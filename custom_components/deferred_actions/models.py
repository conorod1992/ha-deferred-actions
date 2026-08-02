"""Data models and safe formatting helpers for Deferred Actions."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import UTC, datetime
from enum import StrEnum
from typing import Any


class JobStatus(StrEnum):
    """A deferred job state."""

    PENDING = "pending"
    PAUSED = "paused"
    EXECUTING = "executing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    FAILED = "failed"
    MISSED = "missed"


class DeferredActionsError(Exception):
    """Base error with a stable API code."""

    code = "deferred_actions_error"


class JobNotFoundError(DeferredActionsError):
    """No job matched a selector."""

    code = "not_found"


class AmbiguousJobError(DeferredActionsError):
    """Several jobs matched a selector."""

    code = "ambiguous"

    def __init__(self, candidates: list[dict[str, Any]]) -> None:
        super().__init__("Several deferred actions match; choose one by ID")
        self.candidates = candidates


class InvalidActionError(DeferredActionsError):
    code = "invalid_action"


class InvalidTimeError(DeferredActionsError):
    code = "invalid_time"


class InvalidStatusError(DeferredActionsError):
    code = "invalid_status"


class RevisionConflictError(DeferredActionsError):
    code = "revision_conflict"


class ConflictError(DeferredActionsError):
    code = "job_key_conflict"


class BulkConfirmationError(DeferredActionsError):
    code = "bulk_confirmation_required"


class ExecutionFailedError(DeferredActionsError):
    code = "execution_failed"


def utc_now() -> datetime:
    """Return an aware UTC timestamp."""
    return datetime.now(UTC)


def ensure_utc(value: datetime) -> datetime:
    """Require an aware datetime and normalize it to UTC."""
    if value.tzinfo is None or value.utcoffset() is None:
        raise InvalidTimeError("execute_at must include an explicit UTC offset")
    return value.astimezone(UTC)


@dataclass(slots=True)
class DeferredJob:
    """Persistent deferred action record."""

    id: str
    name: str
    execute_at: datetime
    sequence: list[dict[str, Any]]
    created_at: datetime
    modified_at: datetime
    description: str | None = None
    status: JobStatus = JobStatus.PENDING
    completed_at: datetime | None = None
    job_key: str | None = None
    tags: list[str] = field(default_factory=list)
    source: str = "unknown"
    target_entities: list[str] = field(default_factory=list)
    attribution: dict[str, Any] = field(default_factory=dict)
    linkage: dict[str, Any] = field(default_factory=dict)
    last_error: str | None = None
    revision: int = 1

    def to_storage(self) -> dict[str, Any]:
        """Serialize the complete record for Home Assistant storage."""
        data = asdict(self)
        data["status"] = self.status.value
        for key in ("execute_at", "created_at", "modified_at", "completed_at"):
            value = data[key]
            data[key] = value.isoformat() if value else None
        return data

    @classmethod
    def from_storage(cls, data: dict[str, Any]) -> DeferredJob:
        """Deserialize and validate a stored job."""
        values = dict(data)
        for key in ("execute_at", "created_at", "modified_at"):
            values[key] = ensure_utc(datetime.fromisoformat(values[key]))
        if values.get("completed_at"):
            values["completed_at"] = ensure_utc(datetime.fromisoformat(values["completed_at"]))
        values["status"] = JobStatus(values["status"])
        return cls(**values)

    def public_dict(self, local_tz: Any, now: datetime | None = None) -> dict[str, Any]:
        """Return JSON-safe public data with UTC and local time."""
        current = now or utc_now()
        data = self.to_storage()
        data["execute_at"] = self.execute_at.isoformat().replace("+00:00", "Z")
        data["execute_at_local"] = self.execute_at.astimezone(local_tz).isoformat()
        data["seconds_remaining"] = max(0, int((self.execute_at - current).total_seconds()))
        data["action_summary"] = summarize_sequence(self.sequence)
        return data


def _friendly(value: str) -> str:
    return value.rsplit(".", 1)[-1].replace("_", " ").title()


def summarize_sequence(sequence: list[dict[str, Any]]) -> str:
    """Create a non-rendering, non-sensitive action summary."""
    if len(sequence) != 1:
        return f"Run {len(sequence)} actions"
    action = sequence[0]
    service = action.get("action") or action.get("service")
    if not isinstance(service, str):
        return "Run deferred action"
    target = action.get("target") if isinstance(action.get("target"), dict) else {}
    entity = target.get("entity_id")
    if isinstance(entity, list):
        entity = entity[0] if len(entity) == 1 else None
    label = _friendly(entity) if isinstance(entity, str) else "target"
    operation = service.rsplit(".", 1)[-1]
    verbs = {
        "turn_on": "Turn on",
        "turn_off": "Turn off",
        "toggle": "Toggle",
        "lock": "Lock",
        "unlock": "Unlock",
        "media_play": "Play",
        "media_pause": "Pause",
    }
    if operation in verbs:
        return f"{verbs[operation]} {label}"
    if service.startswith("script."):
        return f"Run script {_friendly(service)}"
    return f"Run {_friendly(service)}"
