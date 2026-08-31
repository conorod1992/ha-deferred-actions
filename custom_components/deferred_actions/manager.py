"""Persistent scheduler and job operations for Deferred Actions."""

from __future__ import annotations

import asyncio
import logging
from collections import Counter
from collections.abc import Awaitable, Callable
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant, callback, valid_entity_id
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.util import dt as dt_util

from .const import (
    CONDITION_CANCEL,
    CONDITION_FAIL,
    CONDITION_FAILURE_MODES,
    CONF_DEFAULT_CONFLICT_MODE,
    CONF_HISTORY_ENABLED,
    CONF_HISTORY_RETENTION_DAYS,
    CONF_MAX_HISTORY_RECORDS,
    CONF_OVERDUE_GRACE_MINUTES,
    CONF_OVERDUE_POLICY,
    CONF_SAFE_ALLOWED_DOMAINS,
    CONF_SAFE_BLOCKED_ACTIONS,
    CONFLICT_CANCEL,
    CONFLICT_KEEP_ALL,
    CONFLICT_MODES,
    CONFLICT_REJECT,
    CONFLICT_REPLACE,
    DEFAULT_OPTIONS,
    EVENT_PREFIX,
    HISTORY_STATUSES,
    OVERDUE_EXECUTE,
    OVERDUE_GRACE,
    OVERDUE_POLICIES,
    SAFE_ACTIONS,
    SAFE_DATA_KEYS,
    SIGNAL_UPDATE,
)
from .executor import (
    async_conditions_pass,
    async_execute_job,
    async_validate_conditions,
    async_validate_sequence,
)
from .models import (
    AmbiguousJobError,
    BulkConfirmationError,
    ConflictError,
    DeferredJob,
    InvalidConditionError,
    InvalidStatusError,
    InvalidTimeError,
    JobNotFoundError,
    JobStatus,
    ManagerUnavailableError,
    RevisionConflictError,
    UnsafeActionError,
    ensure_utc,
    extract_entity_ids,
    merge_entity_ids,
    utc_now,
)
from .storage import DeferredActionsStorage

_LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class _PreparedCreate:
    """Validated create data reserved for a later atomic commit."""

    job: DeferredJob
    conflict_mode: str
    reservation_token: str | None = None


class DeferredActionsManager:
    """Own storage, scheduling, execution and all queue mutations."""

    def __init__(self, hass: HomeAssistant, options: dict[str, Any]) -> None:
        self.hass = hass
        self.options = {**DEFAULT_OPTIONS, **options}
        self.jobs: dict[str, DeferredJob] = {}
        self.invalid_records: list[dict[str, Any]] = []
        self._storage = DeferredActionsStorage(hass)
        self._lock = asyncio.Lock()
        self._cancel_next: Callable[[], None] | None = None
        self._listeners: set[Callable[[dict[str, Any]], None]] = set()
        self._execution_tasks: set[asyncio.Task[Any]] = set()
        self._create_reservations: dict[str, str] = {}
        self._unloaded = False

    @property
    def scheduler_active(self) -> bool:
        return self._cancel_next is not None

    @property
    def available(self) -> bool:
        return not self._unloaded

    async def async_initialize(self) -> None:
        """Load storage, recover overdue jobs, and start scheduling."""
        self.jobs, self.invalid_records = await self._storage.async_load()
        await self.async_cleanup_history()
        await self._async_recover_overdue()
        async with self._lock:
            self._async_reschedule_locked()

    async def async_unload(self) -> bool:
        """Stop callbacks and flush storage."""
        async with self._lock:
            self._unloaded = True
            if self._cancel_next:
                self._cancel_next()
                self._cancel_next = None
            tasks = tuple(self._execution_tasks)
        for task in tasks:
            task.cancel()
        if tasks:
            _, pending = await asyncio.wait(tasks, timeout=10)
            if pending:
                _LOGGER.warning(
                    "%s deferred action execution task(s) did not stop during unload",
                    len(pending),
                )
                async with self._lock:
                    self._unloaded = False
                    self._async_reschedule_locked()
                return False
        self._listeners.clear()
        async with self._lock:
            await self._storage.async_save(self.jobs)
        return True

    def update_options(self, options: dict[str, Any]) -> None:
        self.options = {**DEFAULT_OPTIONS, **options}

    @callback
    def async_subscribe(self, listener: Callable[[dict[str, Any]], None]) -> Callable[[], None]:
        self._listeners.add(listener)
        return lambda: self._listeners.discard(listener)

    def _public(self, job: DeferredJob) -> dict[str, Any]:
        local_tz = dt_util.get_time_zone(self.hass.config.time_zone) or dt_util.UTC
        data = job.public_dict(local_tz)
        policy, grace = self._effective_overdue(job)
        data["effective_overdue_policy"] = policy
        data["effective_overdue_grace_minutes"] = grace.total_seconds() / 60
        return data

    def _event_data(self, job: DeferredJob) -> dict[str, Any]:
        data = {
            "job_id": job.id,
            "name": job.name,
            "status": job.status.value,
            "execute_at": job.execute_at.isoformat(),
            "source": job.source,
            "job_key": job.job_key,
        }
        if job.last_error:
            data["error"] = job.last_error
        if job.terminal_reason:
            data["reason"] = job.terminal_reason
        return data

    @callback
    def _notify(self, event: str, job: DeferredJob | None = None, **data: Any) -> None:
        payload = {"event": event, **data}
        if job:
            payload["job"] = self._public(job)
        for listener in tuple(self._listeners):
            listener(payload)
        async_dispatcher_send(self.hass, SIGNAL_UPDATE)
        if job and event.startswith("job_"):
            self.hass.bus.async_fire(
                EVENT_PREFIX + event.removeprefix("job_"), self._event_data(job)
            )
        summary_event = {"event": "queue_summary", "summary": self.summary()}
        for listener in tuple(self._listeners):
            listener(summary_event)

    async def _save_and_schedule_locked(self, *, durable: bool = False) -> None:
        if durable:
            await self._storage.async_save(self.jobs)
        else:
            await self._storage.async_delay_save(self.jobs)
        self._async_reschedule_locked()

    async def _durable_save_with_rollback_locked(self, snapshots: dict[str, DeferredJob]) -> None:
        """Persist queue state, restoring existing records if persistence fails."""
        try:
            await self._storage.async_save(self.jobs)
        except BaseException:
            self.jobs.update(snapshots)
            self._async_reschedule_locked()
            raise
        self._async_reschedule_locked()

    @callback
    def _async_reschedule_locked(self) -> None:
        if self._cancel_next:
            self._cancel_next()
            self._cancel_next = None
        if self._unloaded:
            return
        wake_times = [j.execute_at for j in self.jobs.values() if j.status == JobStatus.PENDING]
        wake_times.extend(
            j.valid_until
            for j in self.jobs.values()
            if j.status in {JobStatus.PENDING, JobStatus.PAUSED} and j.valid_until
        )
        if not wake_times:
            return
        due = min(wake_times)
        self._cancel_next = async_track_point_in_utc_time(self.hass, self._async_due_callback, due)

    async def _async_due_callback(self, now: datetime) -> None:
        if self._cancel_next:
            self._cancel_next()
        self._cancel_next = None
        due: list[DeferredJob] = []
        expired: list[DeferredJob] = []
        async with self._lock:
            if self._unloaded:
                return
            snapshots: dict[str, DeferredJob] = {}
            for job in self.jobs.values():
                if (
                    job.status in {JobStatus.PENDING, JobStatus.PAUSED}
                    and job.valid_until
                    and job.valid_until <= now
                ):
                    snapshots[job.id] = deepcopy(job)
                    self._expire_locked(job, now, notify=False)
                    expired.append(job)
                    continue
                if job.status == JobStatus.PENDING and job.execute_at <= now:
                    snapshots[job.id] = deepcopy(job)
                    job.status = JobStatus.EXECUTING
                    job.modified_at = utc_now()
                    job.revision += 1
                    due.append(job)
            if snapshots:
                await self._durable_save_with_rollback_locked(snapshots)
            else:
                self._async_reschedule_locked()
            for job in expired:
                self._notify("job_expired", job)
            for job in due:
                self._notify("job_started", job)
        await asyncio.gather(
            *(self._async_execute_tracked(job) for job in due), return_exceptions=True
        )

    async def _async_execute_tracked(self, job: DeferredJob) -> dict[str, Any]:
        """Run an execution in a task owned and cancellable by this manager."""
        return await self.async_run_owned(
            lambda: self._async_finish_execution(job),
            f"Deferred action execution: {job.id}",
        )

    async def async_run_owned(
        self, work: Awaitable[Any] | Callable[[], Awaitable[Any]], name: str
    ) -> Any:
        """Atomically register manager-owned action work or reject it before execution."""
        async with self._lock:
            if self._unloaded:
                if not callable(work):
                    close = getattr(work, "close", None)
                    if close is not None:
                        close()
                raise ManagerUnavailableError("Deferred Actions is unloading")
            awaitable = work() if callable(work) else work
            try:
                task = self.hass.async_create_task(awaitable, name)
            except BaseException:
                close = getattr(awaitable, "close", None)
                if close is not None:
                    close()
                raise
            self._execution_tasks.add(task)
            task.add_done_callback(self._execution_tasks.discard)
        return await task

    async def _async_finish_execution(self, job: DeferredJob) -> dict[str, Any]:
        if self._unloaded:
            return self._public(job)
        try:
            conditions_pass = await async_conditions_pass(self.hass, job)
            if conditions_pass:
                await async_execute_job(self.hass, job)
        except Exception as err:  # Home Assistant action errors are heterogeneous
            _LOGGER.exception("Deferred action %s failed", job.id)
            status = JobStatus.FAILED
            last_error = str(err)[:500] or type(err).__name__
            terminal_reason = None
            event = "job_failed"
        else:
            if not conditions_pass:
                reason = "Execution conditions were false"
                if job.condition_failure == CONDITION_CANCEL:
                    status = JobStatus.CANCELLED
                    last_error = None
                    terminal_reason = reason
                    event = "job_cancelled"
                elif job.condition_failure == CONDITION_FAIL:
                    status = JobStatus.FAILED
                    last_error = reason
                    terminal_reason = None
                    event = "job_failed"
                else:
                    status = JobStatus.SKIPPED
                    last_error = None
                    terminal_reason = reason
                    event = "job_skipped"
            else:
                status = JobStatus.COMPLETED
                last_error = None
                terminal_reason = None
                event = "job_completed"
        async with self._lock:
            if self._unloaded:
                return self._public(job)
            current = self.jobs.get(job.id)
            if current is None or current.status != JobStatus.EXECUTING:
                return self._public(job)
            current.status = status
            current.last_error = last_error
            current.terminal_reason = terminal_reason
            current.completed_at = utc_now()
            current.modified_at = current.completed_at
            current.revision += 1
            await self._save_and_schedule_locked(durable=True)
            self._notify(event, current)
            return self._public(current)

    def _expire_locked(self, job: DeferredJob, now: datetime, *, notify: bool = True) -> None:
        job.status = JobStatus.EXPIRED
        job.completed_at = now
        job.modified_at = now
        job.last_error = None
        job.terminal_reason = "Validity cutoff passed before execution began"
        job.revision += 1
        if notify:
            self._notify("job_expired", job)

    def _effective_overdue(self, job: DeferredJob) -> tuple[str, timedelta]:
        policy = job.overdue_policy or self.options[CONF_OVERDUE_POLICY]
        grace_data = job.overdue_grace
        grace = (
            timedelta(**{key: float(value) for key, value in grace_data.items()})
            if grace_data is not None
            else timedelta(minutes=self.options[CONF_OVERDUE_GRACE_MINUTES])
        )
        return policy, grace

    @staticmethod
    def _validate_overdue(
        policy: str | None, grace: dict[str, float] | None
    ) -> tuple[str | None, dict[str, float] | None]:
        if policy is not None and policy not in OVERDUE_POLICIES:
            raise InvalidTimeError(f"overdue_policy must be one of {', '.join(OVERDUE_POLICIES)}")
        if grace is not None:
            if not isinstance(grace, dict):
                raise InvalidTimeError("overdue_grace must be a duration object or null")
            try:
                seconds = timedelta(
                    **{key: float(value) for key, value in grace.items()}
                ).total_seconds()
            except (TypeError, ValueError) as err:
                raise InvalidTimeError("overdue_grace is not a valid duration") from err
            if seconds < 0:
                raise InvalidTimeError("overdue_grace must not be negative")
        return policy, grace

    @staticmethod
    def _parse_valid_until(value: str | datetime | None, execute_at: datetime) -> datetime | None:
        if value is None:
            return None
        try:
            parsed = datetime.fromisoformat(value) if isinstance(value, str) else value
            cutoff = ensure_utc(parsed, "valid_until")
        except (AttributeError, TypeError, ValueError) as err:
            raise InvalidTimeError("valid_until is not a valid offset-aware timestamp") from err
        if cutoff <= execute_at:
            raise InvalidTimeError("valid_until must be after the scheduled execution time")
        return cutoff

    async def _async_recover_overdue(self) -> None:
        now = utc_now()
        execute: list[DeferredJob] = []
        async with self._lock:
            for job in self.jobs.values():
                if job.status == JobStatus.EXECUTING:
                    job.status = JobStatus.FAILED
                    job.completed_at = now
                    job.modified_at = now
                    job.last_error = "Execution was interrupted by a Home Assistant restart or integration reload"
                    job.terminal_reason = None
                    job.revision += 1
                    self._notify("job_failed", job)
                    continue
                if (
                    job.status in {JobStatus.PENDING, JobStatus.PAUSED}
                    and job.valid_until
                    and job.valid_until <= now
                ):
                    self._expire_locked(job, now)
                    continue
                if job.status != JobStatus.PENDING or job.execute_at > now:
                    continue
                if job.valid_until and job.valid_until <= now:
                    self._expire_locked(job, now)
                    continue
                policy, grace = self._effective_overdue(job)
                should_execute = policy == OVERDUE_EXECUTE or (
                    policy == OVERDUE_GRACE and now - job.execute_at <= grace
                )
                if should_execute:
                    job.status = JobStatus.EXECUTING
                    execute.append(job)
                else:
                    job.status = JobStatus.MISSED
                    job.completed_at = now
                    job.last_error = None
                    job.terminal_reason = (
                        "Execution time passed while Home Assistant was unavailable"
                    )
                    self._notify("job_missed", job)
                job.modified_at = now
                job.revision += 1
            await self._storage.async_save(self.jobs)
        await asyncio.gather(
            *(self._async_execute_tracked(job) for job in execute), return_exceptions=True
        )

    @staticmethod
    def _calculate_time(
        execute_at: str | datetime | None, delay: dict[str, float] | None
    ) -> datetime:
        if (execute_at is None) == (delay is None):
            raise InvalidTimeError("Provide exactly one of execute_at or delay")
        if execute_at is not None:
            try:
                parsed = (
                    datetime.fromisoformat(execute_at)
                    if isinstance(execute_at, str)
                    else execute_at
                )
                result = ensure_utc(parsed)
            except (AttributeError, ValueError, TypeError) as err:
                raise InvalidTimeError("execute_at is not a valid offset-aware timestamp") from err
        else:
            if not isinstance(delay, dict) or not delay:
                raise InvalidTimeError("delay must be non-empty")
            try:
                values = {key: float(value) for key, value in delay.items()}
                seconds = timedelta(**values).total_seconds()
            except (OverflowError, TypeError, ValueError) as err:
                raise InvalidTimeError("delay is not a valid duration") from err
            if seconds <= 0:
                raise InvalidTimeError("delay must be positive")
            result = utc_now() + timedelta(seconds=seconds)
        if result <= utc_now():
            raise InvalidTimeError("execution time must be in the future")
        return result

    @staticmethod
    def _validate_create_metadata(
        *,
        name: Any,
        description: Any,
        job_key: Any,
        tags: Any,
        target_entities: Any,
        conflict_mode: Any,
    ) -> tuple[str, list[str], list[str]]:
        if not isinstance(name, str) or not name.strip():
            raise ValueError("name must be a non-empty string")
        if description is not None and not isinstance(description, str):
            raise ValueError("description must be a string or null")
        if job_key is not None and not isinstance(job_key, str):
            raise ValueError("job_key must be a string or null")
        if not isinstance(tags, list) or not all(isinstance(tag, str) for tag in tags):
            raise ValueError("tags must be a list of strings")
        if not isinstance(target_entities, list) or not all(
            isinstance(entity_id, str) and valid_entity_id(entity_id)
            for entity_id in target_entities
        ):
            raise ValueError("target_entities must be a list of valid entity IDs")
        if conflict_mode not in CONFLICT_MODES:
            raise ValueError(f"conflict_mode must be one of {', '.join(CONFLICT_MODES)}")
        return name.strip(), list(tags), list(target_entities)

    async def async_prepare_create(
        self,
        *,
        name: str,
        sequence: list[dict[str, Any]],
        execute_at: str | datetime | None = None,
        delay: dict[str, float] | None = None,
        description: str | None = None,
        job_key: str | None = None,
        tags: list[str] | None = None,
        source: str = "unknown",
        target_entities: list[str] | None = None,
        conflict_mode: str | None = None,
        attribution: dict[str, Any] | None = None,
        linkage: dict[str, Any] | None = None,
        conditions: list[dict[str, Any]] | None = None,
        condition_failure: str = "skip",
        overdue_policy: str | None = None,
        overdue_grace: dict[str, float] | None = None,
        valid_until: str | datetime | None = None,
    ) -> _PreparedCreate:
        """Validate and reserve a create without exposing or scheduling the job."""
        mode = conflict_mode or self.options[CONF_DEFAULT_CONFLICT_MODE]
        clean_name, clean_tags, clean_targets = self._validate_create_metadata(
            name=name,
            description=description,
            job_key=job_key,
            tags=[] if tags is None else tags,
            target_entities=[] if target_entities is None else target_entities,
            conflict_mode=mode,
        )
        normalized = await async_validate_sequence(self.hass, sequence)
        normalized_conditions = await async_validate_conditions(self.hass, conditions)
        if condition_failure not in CONDITION_FAILURE_MODES:
            raise InvalidConditionError(
                f"condition_failure must be one of {', '.join(CONDITION_FAILURE_MODES)}"
            )
        overdue_policy, overdue_grace = self._validate_overdue(overdue_policy, overdue_grace)
        when = self._calculate_time(execute_at, delay)
        cutoff = self._parse_valid_until(valid_until, when)
        discovered_targets = extract_entity_ids(normalized)
        condition_entities = extract_entity_ids(normalized_conditions)
        merged_targets = merge_entity_ids(discovered_targets, clean_targets)
        now = utc_now()
        job = DeferredJob(
            id=uuid4().hex,
            name=clean_name,
            description=description,
            execute_at=when,
            sequence=normalized,
            created_at=now,
            modified_at=now,
            job_key=job_key,
            tags=clean_tags,
            source=source,
            target_entities=merged_targets,
            explicit_target_entities=clean_targets,
            condition_entities=condition_entities,
            conditions=normalized_conditions,
            condition_failure=condition_failure,
            overdue_policy=overdue_policy,
            overdue_grace=overdue_grace,
            valid_until=cutoff,
            attribution=dict(attribution or {}),
            linkage=dict(linkage or {}),
        )
        reservation_token = None
        async with self._lock:
            if self._unloaded:
                raise ConflictError("The manager is unloading")
            matches = [
                j
                for j in self.jobs.values()
                if job_key
                and j.job_key == job_key
                and j.status in {JobStatus.PENDING, JobStatus.PAUSED}
            ]
            if matches and mode == CONFLICT_REJECT:
                raise ConflictError(f"An active job already uses job_key {job_key}")
            if job_key and mode != CONFLICT_KEEP_ALL:
                if job_key in self._create_reservations:
                    raise ConflictError(f"Another create is in progress for job_key {job_key}")
                reservation_token = uuid4().hex
                self._create_reservations[job_key] = reservation_token
        return _PreparedCreate(job, mode, reservation_token)

    async def async_abort_create(self, prepared: _PreparedCreate) -> None:
        """Release a create reservation after its surrounding operation failed."""
        if prepared.reservation_token is None or prepared.job.job_key is None:
            return
        async with self._lock:
            if self._create_reservations.get(prepared.job.job_key) == prepared.reservation_token:
                del self._create_reservations[prepared.job.job_key]

    async def async_commit_create(self, prepared: _PreparedCreate) -> dict[str, Any]:
        """Commit a previously validated create atomically and durably."""
        candidate = prepared.job
        mode = prepared.conflict_mode
        async with self._lock:
            if self._unloaded:
                raise ConflictError("The manager is unloading")
            if prepared.reservation_token is not None and (
                candidate.job_key is None
                or self._create_reservations.get(candidate.job_key) != prepared.reservation_token
            ):
                raise ConflictError("The create reservation is no longer valid")
            try:
                matches = [
                    job
                    for job in self.jobs.values()
                    if candidate.job_key
                    and job.job_key == candidate.job_key
                    and job.status in {JobStatus.PENDING, JobStatus.PAUSED}
                ]
                now = utc_now()
                snapshots = {job.id: deepcopy(job) for job in matches}
                cancelled: list[DeferredJob] = []
                try:
                    if matches and mode == CONFLICT_REJECT:
                        raise ConflictError(
                            f"An active job already uses job_key {candidate.job_key}"
                        )
                    if matches and mode == CONFLICT_REPLACE:
                        job = max(matches, key=lambda item: item.created_at)
                        for existing in matches:
                            if existing.id == job.id:
                                continue
                            existing.status = JobStatus.CANCELLED
                            existing.completed_at = now
                            existing.modified_at = now
                            existing.revision += 1
                            cancelled.append(existing)
                        job.name = candidate.name
                        job.description = candidate.description
                        job.sequence = candidate.sequence
                        job.conditions = candidate.conditions
                        job.condition_failure = candidate.condition_failure
                        job.execute_at = candidate.execute_at
                        job.valid_until = candidate.valid_until
                        job.overdue_policy = candidate.overdue_policy
                        job.overdue_grace = candidate.overdue_grace
                        job.tags = candidate.tags
                        job.source = candidate.source
                        job.attribution = dict(candidate.attribution)
                        job.linkage = dict(candidate.linkage)
                        job.target_entities = candidate.target_entities
                        job.explicit_target_entities = candidate.explicit_target_entities
                        job.condition_entities = candidate.condition_entities
                        job.status = JobStatus.PENDING
                        job.completed_at = None
                        job.last_error = None
                        job.terminal_reason = None
                        job.modified_at = now
                        job.revision += 1
                        await self._save_and_schedule_locked(durable=True)
                        for existing in cancelled:
                            self._notify("job_cancelled", existing)
                        self._notify("job_updated", job)
                        return self._public(job)
                    if matches and mode == CONFLICT_CANCEL:
                        for existing in matches:
                            existing.status = JobStatus.CANCELLED
                            existing.completed_at = now
                            existing.modified_at = now
                            existing.revision += 1
                            cancelled.append(existing)
                    self.jobs[candidate.id] = candidate
                    await self._save_and_schedule_locked(durable=True)
                    for existing in cancelled:
                        self._notify("job_cancelled", existing)
                    self._notify("job_created", candidate)
                    return self._public(candidate)
                except BaseException:
                    self.jobs.pop(candidate.id, None)
                    self.jobs.update(snapshots)
                    self._async_reschedule_locked()
                    raise
            finally:
                if (
                    prepared.reservation_token is not None
                    and candidate.job_key is not None
                    and self._create_reservations.get(candidate.job_key)
                    == prepared.reservation_token
                ):
                    del self._create_reservations[candidate.job_key]

    async def async_create(self, **kwargs: Any) -> dict[str, Any]:
        """Validate and commit a new deferred action."""
        prepared = await self.async_prepare_create(**kwargs)
        try:
            return await self.async_commit_create(prepared)
        except BaseException:
            await self.async_abort_create(prepared)
            raise

    @staticmethod
    def _contains_template(value: Any) -> bool:
        if isinstance(value, str):
            return "{{" in value or "{%" in value
        if isinstance(value, dict):
            return any(DeferredActionsManager._contains_template(item) for item in value.values())
        if isinstance(value, list):
            return any(DeferredActionsManager._contains_template(item) for item in value)
        return False

    async def async_create_safe(
        self,
        *,
        name: str,
        action: str | None = None,
        service: str | None = None,
        target_entities: list[str] | str,
        data: dict[str, Any] | None = None,
        conditions: list[dict[str, Any]] | None = None,
        attribution: dict[str, Any] | None = None,
        **job_data: Any,
    ) -> dict[str, Any]:
        """Create an ordinary job through the deliberately restricted interface."""
        allowed_job_fields = {
            "execute_at",
            "delay",
            "description",
            "job_key",
            "tags",
            "conflict_mode",
            "condition_failure",
            "overdue_policy",
            "overdue_grace",
            "valid_until",
        }
        unsupported_job_fields = set(job_data) - allowed_job_fields
        if unsupported_job_fields:
            raise UnsafeActionError(
                f"fields are not accepted by create_safe: {', '.join(sorted(unsupported_job_fields))}"
            )
        if bool(action) == bool(service):
            raise UnsafeActionError("Provide exactly one of action or service")
        requested = action or service
        if not isinstance(requested, str) or requested.count(".") != 1:
            raise UnsafeActionError("action must be a literal domain.action name")
        if self._contains_template(requested):
            raise UnsafeActionError("templates are not allowed by create_safe")
        domain, operation = requested.split(".", 1)
        allowed_domains = set(self.options[CONF_SAFE_ALLOWED_DOMAINS])
        blocked_actions = set(self.options[CONF_SAFE_BLOCKED_ACTIONS])
        if requested in blocked_actions:
            raise UnsafeActionError(f"{requested} is explicitly blocked")
        if domain not in allowed_domains:
            raise UnsafeActionError(f"domain {domain} is not enabled for safe scheduling")
        if operation not in SAFE_ACTIONS.get(domain, set()):
            raise UnsafeActionError(f"{requested} is not in the conservative safe action set")
        entities = [target_entities] if isinstance(target_entities, str) else list(target_entities)
        if not entities or any(
            not isinstance(entity, str)
            or self._contains_template(entity)
            or not valid_entity_id(entity)
            or entity.split(".", 1)[0] != domain
            for entity in entities
        ):
            raise UnsafeActionError(
                "target_entities must be literal entity IDs in the action domain"
            )
        service_data = dict(data or {})
        unsupported = set(service_data) - SAFE_DATA_KEYS
        if unsupported:
            raise UnsafeActionError(
                f"service data keys are not allowed: {', '.join(sorted(unsupported))}"
            )
        if self._contains_template(service_data):
            raise UnsafeActionError("templates are not allowed by create_safe")
        for item in conditions or []:
            if not isinstance(item, dict) or item.get("condition") not in {
                "state",
                "numeric_state",
            }:
                raise UnsafeActionError(
                    "create_safe only accepts simple state or numeric_state conditions"
                )
            allowed_condition_keys = (
                {"condition", "entity_id", "state", "attribute"}
                if item.get("condition") == "state"
                else {"condition", "entity_id", "above", "below", "attribute"}
            )
            if set(item) - allowed_condition_keys:
                raise UnsafeActionError("safe condition contains unsupported fields")
            condition_entities = item.get("entity_id")
            condition_entities = (
                [condition_entities] if isinstance(condition_entities, str) else condition_entities
            )
            if (
                self._contains_template(item)
                or not isinstance(condition_entities, list)
                or not condition_entities
                or any(
                    not isinstance(entity, str) or not valid_entity_id(entity)
                    for entity in condition_entities
                )
            ):
                raise UnsafeActionError(
                    "safe conditions require literal entity IDs and no templates"
                )
        safe_attribution = dict(attribution or {})
        safe_attribution["interface"] = "create_safe"
        return await self.async_create(
            name=name,
            sequence=[
                {"action": requested, "target": {"entity_id": entities}, "data": service_data}
            ],
            target_entities=entities,
            conditions=conditions,
            source="safe_service",
            attribution=safe_attribution,
            **job_data,
        )

    def resolve(
        self,
        *,
        job_id: str | None = None,
        job_key: str | None = None,
        name: str | None = None,
        target_entity: str | None = None,
        most_recent_pending: bool = False,
    ) -> DeferredJob:
        if job_id:
            if job := self.jobs.get(job_id):
                return job
            raise JobNotFoundError(f"Deferred action {job_id} was not found")
        matches = list(self.jobs.values())
        if job_key:
            matches = [j for j in matches if j.job_key == job_key]
        if name:
            matches = [j for j in matches if j.name.casefold() == name.casefold()]
        if target_entity:
            matches = [
                j
                for j in matches
                if target_entity in j.target_entities or target_entity in j.condition_entities
            ]
        if most_recent_pending:
            matches = [j for j in matches if j.status == JobStatus.PENDING]
            if matches:
                return max(matches, key=lambda item: item.created_at)
        if not matches:
            raise JobNotFoundError("No deferred action matched")
        if len(matches) > 1:
            raise AmbiguousJobError(
                [{"id": j.id, "name": j.name, "status": j.status.value} for j in matches]
            )
        return matches[0]

    def async_get(self, **selector: Any) -> dict[str, Any]:
        return self._public(self.resolve(**selector))

    def async_list(
        self,
        *,
        statuses: list[str] | None = None,
        pending_only: bool = False,
        due_before: str | None = None,
        due_after: str | None = None,
        name_query: str | None = None,
        job_key: str | None = None,
        tag: str | None = None,
        source: str | None = None,
        target_entity: str | None = None,
        include_history: bool = True,
        limit: int | None = 100,
        descending: bool = False,
    ) -> dict[str, Any]:
        jobs = list(self.jobs.values())
        if pending_only:
            jobs = [j for j in jobs if j.status == JobStatus.PENDING]
        elif statuses:
            wanted = {JobStatus(value) for value in statuses}
            jobs = [j for j in jobs if j.status in wanted]
        elif not include_history:
            jobs = [j for j in jobs if j.status not in HISTORY_STATUSES]
        if due_before:
            before = ensure_utc(datetime.fromisoformat(due_before))
            jobs = [j for j in jobs if j.execute_at <= before]
        if due_after:
            after = ensure_utc(datetime.fromisoformat(due_after))
            jobs = [j for j in jobs if j.execute_at >= after]
        if name_query:
            query = name_query.casefold()
            jobs = [j for j in jobs if query in j.name.casefold()]
        if job_key:
            jobs = [j for j in jobs if j.job_key == job_key]
        if tag:
            jobs = [j for j in jobs if tag in j.tags]
        if source:
            jobs = [j for j in jobs if j.source == source]
        if target_entity:
            jobs = [
                j
                for j in jobs
                if target_entity in j.target_entities or target_entity in j.condition_entities
            ]
        jobs.sort(
            key=lambda j: (j.status != JobStatus.PENDING, j.execute_at, j.created_at),
            reverse=descending,
        )
        total = len(jobs)
        selected = jobs if limit is None else jobs[:limit]
        return {
            "count": total,
            "jobs": [self._public(j) for j in selected],
            "more": False if limit is None else total > limit,
        }

    async def async_update(
        self, job_id: str, expected_revision: int | None = None, **changes: Any
    ) -> dict[str, Any]:
        allowed = {
            "name",
            "description",
            "sequence",
            "job_key",
            "tags",
            "target_entities",
            "conditions",
            "condition_failure",
            "overdue_policy",
            "overdue_grace",
            "valid_until",
        }
        unknown = set(changes) - allowed
        if unknown:
            raise ValueError(f"Unknown update fields: {', '.join(sorted(unknown))}")
        if not changes:
            raise ValueError("At least one update field is required")
        if "name" in changes:
            if not isinstance(changes["name"], str) or not changes["name"].strip():
                raise ValueError("name must be a non-empty string")
            changes["name"] = changes["name"].strip()
        if (
            "description" in changes
            and changes["description"] is not None
            and not isinstance(changes["description"], str)
        ):
            raise ValueError("description must be a string or null")
        if (
            "job_key" in changes
            and changes["job_key"] is not None
            and not isinstance(changes["job_key"], str)
        ):
            raise ValueError("job_key must be a string or null")
        if "tags" in changes and (
            not isinstance(changes["tags"], list)
            or not all(isinstance(tag, str) for tag in changes["tags"])
        ):
            raise ValueError("tags must be a list of strings")
        if "target_entities" in changes and (
            not isinstance(changes["target_entities"], list)
            or not all(
                isinstance(entity_id, str) and valid_entity_id(entity_id)
                for entity_id in changes["target_entities"]
            )
        ):
            raise ValueError("target_entities must be a list of valid entity IDs")
        if "sequence" in changes:
            changes["sequence"] = await async_validate_sequence(self.hass, changes["sequence"])
        if "conditions" in changes:
            changes["conditions"] = await async_validate_conditions(
                self.hass, changes["conditions"]
            )
        if (
            "condition_failure" in changes
            and changes["condition_failure"] not in CONDITION_FAILURE_MODES
        ):
            raise InvalidConditionError(
                f"condition_failure must be one of {', '.join(CONDITION_FAILURE_MODES)}"
            )
        if "overdue_policy" in changes or "overdue_grace" in changes:
            self._validate_overdue(changes.get("overdue_policy"), changes.get("overdue_grace"))
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status not in {JobStatus.PENDING, JobStatus.PAUSED}:
                raise InvalidStatusError(f"Cannot edit a {job.status.value} job")
            if expected_revision is not None and job.revision != expected_revision:
                raise RevisionConflictError(
                    f"Expected revision {expected_revision}, current revision is {job.revision}"
                )
            if "job_key" in changes and changes["job_key"] in self._create_reservations:
                raise ConflictError("A create is in progress for that job_key")
            if "valid_until" in changes:
                changes["valid_until"] = self._parse_valid_until(
                    changes["valid_until"], job.execute_at
                )
            snapshot = deepcopy(job)
            for key, value in changes.items():
                setattr(job, key, value)
            if "sequence" in changes or "target_entities" in changes:
                if "target_entities" in changes:
                    job.explicit_target_entities = list(changes["target_entities"] or [])
                job.target_entities = merge_entity_ids(
                    extract_entity_ids(job.sequence), job.explicit_target_entities
                )
            if "conditions" in changes:
                job.condition_entities = extract_entity_ids(job.conditions)
            if job.valid_until and job.valid_until <= utc_now():
                self._expire_locked(job, utc_now(), notify=False)
                await self._durable_save_with_rollback_locked({job.id: snapshot})
                self._notify("job_expired", job)
                return self._public(job)
            job.modified_at = utc_now()
            job.revision += 1
            await self._durable_save_with_rollback_locked({job.id: snapshot})
            self._notify("job_updated", job)
            return self._public(job)

    async def async_reschedule(
        self, job_id: str, *, execute_at: str | None = None, delay: dict[str, float] | None = None
    ) -> dict[str, Any]:
        when = self._calculate_time(execute_at, delay)
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status not in {JobStatus.PENDING, JobStatus.PAUSED}:
                raise InvalidStatusError(f"Cannot reschedule a {job.status.value} job")
            if job.valid_until and when >= job.valid_until:
                raise InvalidTimeError("execution time must be before valid_until")
            snapshot = deepcopy(job)
            job.execute_at = when
            job.modified_at = utc_now()
            job.revision += 1
            await self._durable_save_with_rollback_locked({job.id: snapshot})
            self._notify("job_updated", job)
            return self._public(job)

    async def async_extend(self, job_id: str, duration: dict[str, float]) -> dict[str, Any]:
        seconds = timedelta(
            **{key: float(value) for key, value in duration.items()}
        ).total_seconds()
        if not seconds:
            raise InvalidTimeError("duration must not be zero")
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status not in {JobStatus.PENDING, JobStatus.PAUSED}:
                raise InvalidStatusError(f"Cannot extend a {job.status.value} job")
            when = job.execute_at + timedelta(seconds=seconds)
            if when <= utc_now():
                raise InvalidTimeError("resulting execution time must be in the future")
            if job.valid_until and when >= job.valid_until:
                raise InvalidTimeError("resulting execution time must be before valid_until")
            snapshot = deepcopy(job)
            job.execute_at = when
            job.modified_at = utc_now()
            job.revision += 1
            await self._durable_save_with_rollback_locked({job.id: snapshot})
            self._notify("job_updated", job)
            return self._public(job)

    async def async_snooze(self, job_id: str, duration: dict[str, float]) -> dict[str, Any]:
        """Move a pending job later relative to its current scheduled time."""
        try:
            seconds = timedelta(
                **{key: float(value) for key, value in duration.items()}
            ).total_seconds()
        except (TypeError, ValueError) as err:
            raise InvalidTimeError("duration is not valid") from err
        if seconds <= 0:
            raise InvalidTimeError("snooze duration must be positive")
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status != JobStatus.PENDING:
                raise InvalidStatusError(f"Cannot snooze a {job.status.value} job")
            when = job.execute_at + timedelta(seconds=seconds)
            if job.valid_until and when >= job.valid_until:
                raise InvalidTimeError("snooze would reach or pass valid_until")
            snapshot = deepcopy(job)
            job.execute_at = when
            job.modified_at = utc_now()
            job.revision += 1
            await self._durable_save_with_rollback_locked({job.id: snapshot})
            self._notify("job_updated", job)
            return self._public(job)

    async def _async_transition(
        self, job_id: str, source: set[JobStatus], target: JobStatus, event: str
    ) -> dict[str, Any]:
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status not in source:
                raise InvalidStatusError(
                    f"Cannot {event.removeprefix('job_')} a {job.status.value} job"
                )
            snapshot = deepcopy(job)
            job.status = target
            job.modified_at = utc_now()
            job.revision += 1
            if target in HISTORY_STATUSES:
                job.completed_at = job.modified_at
            await self._durable_save_with_rollback_locked({job.id: snapshot})
            self._notify(event, job)
            return self._public(job)

    async def async_cancel(self, job_id: str) -> dict[str, Any]:
        return await self._async_transition(
            job_id, {JobStatus.PENDING, JobStatus.PAUSED}, JobStatus.CANCELLED, "job_cancelled"
        )

    async def async_pause(self, job_id: str) -> dict[str, Any]:
        return await self._async_transition(
            job_id, {JobStatus.PENDING}, JobStatus.PAUSED, "job_paused"
        )

    async def async_resume(
        self, job_id: str, *, execute_at: str | None = None, delay: dict[str, float] | None = None
    ) -> dict[str, Any]:
        replacement = (
            self._calculate_time(execute_at, delay)
            if execute_at is not None or delay is not None
            else None
        )
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status != JobStatus.PAUSED:
                raise InvalidStatusError(f"Cannot resume a {job.status.value} job")
            snapshot = deepcopy(job)
            now = utc_now()
            if replacement:
                if job.valid_until and replacement >= job.valid_until:
                    raise InvalidTimeError("execution time must be before valid_until")
                job.execute_at = replacement
            elif job.execute_at <= now:
                if job.valid_until and job.valid_until <= now:
                    self._expire_locked(job, now, notify=False)
                    await self._durable_save_with_rollback_locked({job.id: snapshot})
                    self._notify("job_expired", job)
                    return self._public(job)
                policy, grace = self._effective_overdue(job)
                if policy != OVERDUE_EXECUTE and not (
                    policy == OVERDUE_GRACE and now - job.execute_at <= grace
                ):
                    job.status = JobStatus.MISSED
                    job.completed_at = now
                    job.modified_at = now
                    job.last_error = None
                    job.terminal_reason = "Execution time passed while the job was paused"
                    job.revision += 1
                    await self._durable_save_with_rollback_locked({job.id: snapshot})
                    self._notify("job_missed", job)
                    return self._public(job)
            job.status = JobStatus.PENDING
            job.modified_at = now
            job.revision += 1
            await self._durable_save_with_rollback_locked({job.id: snapshot})
            self._notify("job_resumed", job)
            return self._public(job)

    async def async_execute_now(self, job_id: str) -> dict[str, Any]:
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status not in {
                JobStatus.PENDING,
                JobStatus.PAUSED,
                JobStatus.FAILED,
                JobStatus.MISSED,
            }:
                raise InvalidStatusError(f"Cannot execute a {job.status.value} job")
            snapshot = deepcopy(job)
            now = utc_now()
            if job.valid_until and job.valid_until <= now:
                self._expire_locked(job, now, notify=False)
                await self._durable_save_with_rollback_locked({job.id: snapshot})
                self._notify("job_expired", job)
                return self._public(job)
            job.status = JobStatus.EXECUTING
            job.completed_at = None
            job.last_error = None
            job.terminal_reason = None
            job.modified_at = now
            job.revision += 1
            await self._durable_save_with_rollback_locked({job.id: snapshot})
            self._notify("job_started", job)
        return await self._async_execute_tracked(job)

    async def async_delete(self, job_id: str) -> dict[str, Any]:
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status == JobStatus.EXECUTING:
                raise InvalidStatusError("An executing job cannot be deleted")
            data = self._public(job)
            snapshot = deepcopy(job)
            del self.jobs[job.id]
            await self._durable_save_with_rollback_locked({job.id: snapshot})
            self._notify("job_deleted", job, job_id=job.id)
            return {"deleted": data}

    async def async_duplicate(
        self,
        job_id: str,
        *,
        execute_at: str | None = None,
        delay: dict[str, float] | None = None,
        name: str | None = None,
    ) -> dict[str, Any]:
        original = self.resolve(job_id=job_id)
        when = self._calculate_time(execute_at, delay)
        validity_window = (
            original.valid_until - original.execute_at if original.valid_until else None
        )
        duplicate_valid_until = when + validity_window if validity_window is not None else None
        return await self.async_create(
            name=name or f"{original.name} (copy)",
            description=original.description,
            sequence=original.sequence,
            execute_at=when,
            tags=original.tags,
            source=original.source,
            target_entities=original.explicit_target_entities,
            conditions=original.conditions,
            condition_failure=original.condition_failure,
            overdue_policy=original.overdue_policy,
            overdue_grace=original.overdue_grace,
            valid_until=duplicate_valid_until,
            attribution=original.attribution,
            linkage={"duplicated_from": original.id},
            conflict_mode=CONFLICT_KEEP_ALL,
        )

    async def async_cancel_all(
        self,
        *,
        confirm_bulk: bool,
        statuses: list[str] | None = None,
        tag: str | None = None,
        job_key: str | None = None,
    ) -> dict[str, Any]:
        if not confirm_bulk:
            raise BulkConfirmationError("confirm_bulk must be true")
        if not any((statuses, tag, job_key)):
            raise BulkConfirmationError("A selector is required for bulk cancellation")
        wanted = {JobStatus(value) for value in statuses} if statuses else None
        async with self._lock:
            candidates = [
                job
                for job in self.jobs.values()
                if job.status in {JobStatus.PENDING, JobStatus.PAUSED}
                and (wanted is None or job.status in wanted)
                and (tag is None or tag in job.tags)
                and (job_key is None or job.job_key == job_key)
            ]
            candidates.sort(
                key=lambda job: (
                    job.status != JobStatus.PENDING,
                    job.execute_at,
                    job.created_at,
                )
            )
            if not candidates:
                return {"count": 0, "jobs": []}
            snapshots = {job.id: deepcopy(job) for job in candidates}
            now = utc_now()
            for job in candidates:
                job.status = JobStatus.CANCELLED
                job.completed_at = now
                job.modified_at = now
                job.revision += 1
            await self._durable_save_with_rollback_locked(snapshots)
            for job in candidates:
                self._notify("job_cancelled", job)
            return {
                "count": len(candidates),
                "jobs": [self._public(job) for job in candidates],
            }

    async def async_delete_history(
        self, *, confirm_bulk: bool, statuses: list[str] | None = None, before: str | None = None
    ) -> dict[str, Any]:
        if not confirm_bulk or not any((statuses, before)):
            raise BulkConfirmationError("confirm_bulk and a selector are required")
        before_dt = ensure_utc(datetime.fromisoformat(before)) if before else None
        history_statuses = {JobStatus(value) for value in HISTORY_STATUSES}
        wanted = {JobStatus(value) for value in statuses} if statuses else history_statuses
        invalid_statuses = wanted - history_statuses
        if invalid_statuses:
            invalid = ", ".join(sorted(status.value for status in invalid_statuses))
            raise InvalidStatusError(
                f"delete_history only accepts history statuses; invalid: {invalid}"
            )
        async with self._lock:
            selected = [
                job
                for job in self.jobs.values()
                if job.status in wanted
                and (before_dt is None or (job.completed_at and job.completed_at < before_dt))
            ]
            snapshots = {job.id: deepcopy(job) for job in selected}
            for job in selected:
                del self.jobs[job.id]
            if snapshots:
                await self._durable_save_with_rollback_locked(snapshots)
        if selected:
            self._notify("history_cleaned", count=len(selected))
        return {"deleted_count": len(selected)}

    async def async_cleanup_history(self) -> dict[str, Any]:
        if not self.options[CONF_HISTORY_ENABLED]:
            cutoff = utc_now()
            maximum = 0
        else:
            cutoff = utc_now() - timedelta(days=self.options[CONF_HISTORY_RETENTION_DAYS])
            maximum = self.options[CONF_MAX_HISTORY_RECORDS]
        async with self._lock:
            if self._unloaded:
                return {"deleted_count": 0}
            history = sorted(
                (j for j in self.jobs.values() if j.status in HISTORY_STATUSES),
                key=lambda j: j.completed_at or j.modified_at,
                reverse=True,
            )
            remove = {j.id for j in history if (j.completed_at or j.modified_at) < cutoff}
            remove.update(j.id for j in history[maximum:])
            snapshots = {job_id: deepcopy(self.jobs[job_id]) for job_id in remove}
            for job_id in remove:
                del self.jobs[job_id]
            if snapshots:
                await self._durable_save_with_rollback_locked(snapshots)
        if remove:
            self._notify("history_cleaned", count=len(remove))
        return {"deleted_count": len(remove)}

    def summary(self) -> dict[str, Any]:
        counts = Counter(job.status.value for job in self.jobs.values())
        pending = sorted(
            (j for j in self.jobs.values() if j.status == JobStatus.PENDING),
            key=lambda j: j.execute_at,
        )
        next_job = pending[0] if pending else None
        local_tz = dt_util.get_time_zone(self.hass.config.time_zone) or dt_util.UTC
        return {
            "pending": counts["pending"],
            "paused": counts["paused"],
            "failed": counts["failed"],
            "counts": dict(counts),
            "next_job_id": next_job.id if next_job else None,
            "next_job_name": next_job.name if next_job else None,
            "next_execution": next_job.execute_at.isoformat().replace("+00:00", "Z")
            if next_job
            else None,
            "next_execution_local": next_job.execute_at.astimezone(local_tz).isoformat()
            if next_job
            else None,
        }
