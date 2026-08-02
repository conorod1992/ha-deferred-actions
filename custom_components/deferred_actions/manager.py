"""Persistent scheduler and job operations for Deferred Actions."""

from __future__ import annotations

import asyncio
import logging
from collections import Counter
from collections.abc import Callable
from datetime import datetime, timedelta
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.util import dt as dt_util

from .const import (
    CONF_DEFAULT_CONFLICT_MODE,
    CONF_HISTORY_ENABLED,
    CONF_HISTORY_RETENTION_DAYS,
    CONF_MAX_HISTORY_RECORDS,
    CONF_OVERDUE_GRACE_MINUTES,
    CONF_OVERDUE_POLICY,
    CONFLICT_CANCEL,
    CONFLICT_KEEP_ALL,
    CONFLICT_REJECT,
    CONFLICT_REPLACE,
    DEFAULT_OPTIONS,
    EVENT_PREFIX,
    HISTORY_STATUSES,
    OVERDUE_EXECUTE,
    OVERDUE_GRACE,
    SIGNAL_UPDATE,
)
from .executor import async_execute_job, async_validate_sequence
from .models import (
    AmbiguousJobError,
    BulkConfirmationError,
    ConflictError,
    DeferredJob,
    InvalidStatusError,
    InvalidTimeError,
    JobNotFoundError,
    JobStatus,
    RevisionConflictError,
    ensure_utc,
    utc_now,
)
from .storage import DeferredActionsStorage

_LOGGER = logging.getLogger(__name__)


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
        self._unloaded = False

    @property
    def scheduler_active(self) -> bool:
        return self._cancel_next is not None

    async def async_initialize(self) -> None:
        """Load storage, recover overdue jobs, and start scheduling."""
        self.jobs, self.invalid_records = await self._storage.async_load()
        await self.async_cleanup_history()
        await self._async_recover_overdue()
        async with self._lock:
            self._async_reschedule_locked()

    async def async_unload(self) -> None:
        """Stop callbacks and flush storage."""
        self._unloaded = True
        if self._cancel_next:
            self._cancel_next()
            self._cancel_next = None
        self._listeners.clear()
        await self._storage.async_save(self.jobs)

    def update_options(self, options: dict[str, Any]) -> None:
        self.options = {**DEFAULT_OPTIONS, **options}

    @callback
    def async_subscribe(self, listener: Callable[[dict[str, Any]], None]) -> Callable[[], None]:
        self._listeners.add(listener)
        return lambda: self._listeners.discard(listener)

    def _public(self, job: DeferredJob) -> dict[str, Any]:
        local_tz = dt_util.get_time_zone(self.hass.config.time_zone) or dt_util.UTC
        return job.public_dict(local_tz)

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

    async def _save_and_schedule_locked(self) -> None:
        await self._storage.async_delay_save(self.jobs)
        self._async_reschedule_locked()

    @callback
    def _async_reschedule_locked(self) -> None:
        if self._cancel_next:
            self._cancel_next()
            self._cancel_next = None
        if self._unloaded:
            return
        pending = [j for j in self.jobs.values() if j.status == JobStatus.PENDING]
        if not pending:
            return
        due = min(pending, key=lambda item: item.execute_at).execute_at
        self._cancel_next = async_track_point_in_utc_time(self.hass, self._async_due_callback, due)

    async def _async_due_callback(self, now: datetime) -> None:
        self._cancel_next = None
        due: list[DeferredJob] = []
        async with self._lock:
            for job in self.jobs.values():
                if job.status == JobStatus.PENDING and job.execute_at <= now:
                    job.status = JobStatus.EXECUTING
                    job.modified_at = utc_now()
                    job.revision += 1
                    due.append(job)
                    self._notify("job_started", job)
            await self._save_and_schedule_locked()
        await asyncio.gather(
            *(self._async_finish_execution(job) for job in due),
            return_exceptions=True,
        )

    async def _async_finish_execution(self, job: DeferredJob) -> dict[str, Any]:
        try:
            await async_execute_job(self.hass, job)
        except Exception as err:  # Home Assistant action errors are heterogeneous
            _LOGGER.exception("Deferred action %s failed", job.id)
            status = JobStatus.FAILED
            error = str(err)[:500] or type(err).__name__
        else:
            status = JobStatus.COMPLETED
            error = None
        async with self._lock:
            current = self.jobs.get(job.id)
            if current is None or current.status != JobStatus.EXECUTING:
                return self._public(job)
            current.status = status
            current.last_error = error
            current.completed_at = utc_now()
            current.modified_at = current.completed_at
            current.revision += 1
            await self._save_and_schedule_locked()
            self._notify("job_failed" if error else "job_completed", current)
            return self._public(current)

    async def _async_recover_overdue(self) -> None:
        now = utc_now()
        execute: list[DeferredJob] = []
        policy = self.options[CONF_OVERDUE_POLICY]
        grace = timedelta(minutes=self.options[CONF_OVERDUE_GRACE_MINUTES])
        async with self._lock:
            for job in self.jobs.values():
                if job.status == JobStatus.EXECUTING:
                    job.status = JobStatus.FAILED
                    job.completed_at = now
                    job.modified_at = now
                    job.last_error = "Execution was interrupted by a Home Assistant restart or integration reload"
                    job.revision += 1
                    self._notify("job_failed", job)
                    continue
                if job.status != JobStatus.PENDING or job.execute_at > now:
                    continue
                should_execute = policy == OVERDUE_EXECUTE or (
                    policy == OVERDUE_GRACE and now - job.execute_at <= grace
                )
                if should_execute:
                    job.status = JobStatus.EXECUTING
                    execute.append(job)
                else:
                    job.status = JobStatus.MISSED
                    job.completed_at = now
                    job.last_error = "Execution time passed while Home Assistant was unavailable"
                    self._notify("job_missed", job)
                job.modified_at = now
                job.revision += 1
            await self._storage.async_save(self.jobs)
        await asyncio.gather(
            *(self._async_finish_execution(job) for job in execute), return_exceptions=True
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
            except (ValueError, TypeError) as err:
                raise InvalidTimeError("execute_at is not a valid offset-aware timestamp") from err
        else:
            if not delay or not any(float(value) for value in delay.values()):
                raise InvalidTimeError("delay must be non-empty")
            seconds = timedelta(
                **{key: float(value) for key, value in delay.items()}
            ).total_seconds()
            if seconds <= 0:
                raise InvalidTimeError("delay must be positive")
            result = utc_now() + timedelta(seconds=seconds)
        if result <= utc_now():
            raise InvalidTimeError("execution time must be in the future")
        return result

    async def async_create(
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
    ) -> dict[str, Any]:
        if not name.strip():
            raise ValueError("name must not be empty")
        normalized = await async_validate_sequence(self.hass, sequence)
        when = self._calculate_time(execute_at, delay)
        mode = conflict_mode or self.options[CONF_DEFAULT_CONFLICT_MODE]
        now = utc_now()
        async with self._lock:
            matches = [
                j
                for j in self.jobs.values()
                if job_key and j.job_key == job_key and j.status == JobStatus.PENDING
            ]
            if matches and mode == CONFLICT_REJECT:
                raise ConflictError(f"A pending job already uses job_key {job_key}")
            if matches and mode == CONFLICT_REPLACE:
                job = max(matches, key=lambda item: item.created_at)
                job.name = name.strip()
                job.description = description
                job.sequence = normalized
                job.execute_at = when
                job.tags = list(tags or [])
                job.target_entities = list(target_entities or [])
                job.modified_at = now
                job.revision += 1
                await self._save_and_schedule_locked()
                self._notify("job_updated", job)
                return self._public(job)
            if matches and mode == CONFLICT_CANCEL:
                for existing in matches:
                    existing.status = JobStatus.CANCELLED
                    existing.completed_at = now
                    existing.modified_at = now
                    existing.revision += 1
                    self._notify("job_cancelled", existing)
            job = DeferredJob(
                id=uuid4().hex,
                name=name.strip(),
                description=description,
                execute_at=when,
                sequence=normalized,
                created_at=now,
                modified_at=now,
                job_key=job_key,
                tags=list(tags or []),
                source=source,
                target_entities=list(target_entities or []),
                attribution=dict(attribution or {}),
                linkage=dict(linkage or {}),
            )
            self.jobs[job.id] = job
            await self._save_and_schedule_locked()
            self._notify("job_created", job)
            return self._public(job)

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
            matches = [j for j in matches if target_entity in j.target_entities]
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
        limit: int = 100,
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
            jobs = [j for j in jobs if target_entity in j.target_entities]
        jobs.sort(
            key=lambda j: (j.status != JobStatus.PENDING, j.execute_at, j.created_at),
            reverse=descending,
        )
        total = len(jobs)
        return {
            "count": total,
            "jobs": [self._public(j) for j in jobs[:limit]],
            "more": total > limit,
        }

    async def async_update(
        self, job_id: str, expected_revision: int | None = None, **changes: Any
    ) -> dict[str, Any]:
        sequence = changes.get("sequence")
        if sequence is not None:
            changes["sequence"] = await async_validate_sequence(self.hass, sequence)
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status not in {JobStatus.PENDING, JobStatus.PAUSED}:
                raise InvalidStatusError(f"Cannot edit a {job.status.value} job")
            if expected_revision is not None and job.revision != expected_revision:
                raise RevisionConflictError(
                    f"Expected revision {expected_revision}, current revision is {job.revision}"
                )
            allowed = {"name", "description", "sequence", "job_key", "tags", "target_entities"}
            for key, value in changes.items():
                if key in allowed and value is not None:
                    setattr(job, key, value)
            job.modified_at = utc_now()
            job.revision += 1
            await self._save_and_schedule_locked()
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
            job.execute_at = when
            job.modified_at = utc_now()
            job.revision += 1
            await self._save_and_schedule_locked()
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
            job.execute_at = when
            job.modified_at = utc_now()
            job.revision += 1
            await self._save_and_schedule_locked()
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
            job.status = target
            job.modified_at = utc_now()
            job.revision += 1
            if target in HISTORY_STATUSES:
                job.completed_at = job.modified_at
            await self._save_and_schedule_locked()
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
            now = utc_now()
            if replacement:
                job.execute_at = replacement
            elif job.execute_at <= now:
                policy = self.options[CONF_OVERDUE_POLICY]
                grace = timedelta(minutes=self.options[CONF_OVERDUE_GRACE_MINUTES])
                if policy != OVERDUE_EXECUTE and not (
                    policy == OVERDUE_GRACE and now - job.execute_at <= grace
                ):
                    job.status = JobStatus.MISSED
                    job.completed_at = now
                    job.modified_at = now
                    job.revision += 1
                    await self._save_and_schedule_locked()
                    self._notify("job_missed", job)
                    return self._public(job)
            job.status = JobStatus.PENDING
            job.modified_at = now
            job.revision += 1
            await self._save_and_schedule_locked()
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
            job.status = JobStatus.EXECUTING
            job.completed_at = None
            job.last_error = None
            job.modified_at = utc_now()
            job.revision += 1
            await self._save_and_schedule_locked()
            self._notify("job_started", job)
        return await self._async_finish_execution(job)

    async def async_delete(self, job_id: str) -> dict[str, Any]:
        async with self._lock:
            job = self.resolve(job_id=job_id)
            if job.status == JobStatus.EXECUTING:
                raise InvalidStatusError("An executing job cannot be deleted")
            data = self._public(job)
            del self.jobs[job.id]
            await self._save_and_schedule_locked()
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
        return await self.async_create(
            name=name or f"{original.name} (copy)",
            description=original.description,
            sequence=original.sequence,
            execute_at=execute_at,
            delay=delay,
            tags=original.tags,
            source=original.source,
            target_entities=original.target_entities,
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
        candidates = self.async_list(statuses=statuses, tag=tag, job_key=job_key, limit=10000)[
            "jobs"
        ]
        cancelled = []
        for item in candidates:
            if item["status"] in {"pending", "paused"}:
                cancelled.append(await self.async_cancel(item["id"]))
        return {"count": len(cancelled), "jobs": cancelled}

    async def async_delete_history(
        self, *, confirm_bulk: bool, statuses: list[str] | None = None, before: str | None = None
    ) -> dict[str, Any]:
        if not confirm_bulk or not any((statuses, before)):
            raise BulkConfirmationError("confirm_bulk and a selector are required")
        before_dt = ensure_utc(datetime.fromisoformat(before)) if before else None
        wanted = {JobStatus(value) for value in statuses} if statuses else HISTORY_STATUSES
        async with self._lock:
            ids = [
                j.id
                for j in self.jobs.values()
                if j.status in wanted
                and (before_dt is None or (j.completed_at and j.completed_at < before_dt))
            ]
            for job_id in ids:
                del self.jobs[job_id]
            await self._save_and_schedule_locked()
        if ids:
            self._notify("history_cleaned", count=len(ids))
        return {"deleted_count": len(ids)}

    async def async_cleanup_history(self) -> dict[str, Any]:
        if not self.options[CONF_HISTORY_ENABLED]:
            cutoff = utc_now()
            maximum = 0
        else:
            cutoff = utc_now() - timedelta(days=self.options[CONF_HISTORY_RETENTION_DAYS])
            maximum = self.options[CONF_MAX_HISTORY_RECORDS]
        async with self._lock:
            history = sorted(
                (j for j in self.jobs.values() if j.status in HISTORY_STATUSES),
                key=lambda j: j.completed_at or j.modified_at,
                reverse=True,
            )
            remove = {j.id for j in history if (j.completed_at or j.modified_at) < cutoff}
            remove.update(j.id for j in history[maximum:])
            for job_id in remove:
                del self.jobs[job_id]
            if remove:
                await self._storage.async_save(self.jobs)
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
