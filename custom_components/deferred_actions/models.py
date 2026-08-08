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
    SKIPPED = "skipped"
    EXPIRED = "expired"


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


class InvalidConditionError(DeferredActionsError):
    code = "invalid_condition"


class UnsafeActionError(DeferredActionsError):
    code = "unsafe_action"


def utc_now() -> datetime:
    """Return an aware UTC timestamp."""
    return datetime.now(UTC)


def ensure_utc(value: datetime, field_name: str = "execute_at") -> datetime:
    """Require an aware datetime and normalize it to UTC."""
    if value.tzinfo is None or value.utcoffset() is None:
        raise InvalidTimeError(f"{field_name} must include an explicit UTC offset")
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
    explicit_target_entities: list[str] = field(default_factory=list)
    condition_entities: list[str] = field(default_factory=list)
    conditions: list[dict[str, Any]] = field(default_factory=list)
    condition_failure: str = "skip"
    overdue_policy: str | None = None
    overdue_grace: dict[str, float] | None = None
    valid_until: datetime | None = None
    attribution: dict[str, Any] = field(default_factory=dict)
    linkage: dict[str, Any] = field(default_factory=dict)
    last_error: str | None = None
    terminal_reason: str | None = None
    revision: int = 1

    def to_storage(self) -> dict[str, Any]:
        """Serialize the complete record for Home Assistant storage."""
        data = asdict(self)
        data["status"] = self.status.value
        for key in ("execute_at", "created_at", "modified_at", "completed_at", "valid_until"):
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
        if values.get("valid_until"):
            values["valid_until"] = ensure_utc(
                datetime.fromisoformat(values["valid_until"]), "valid_until"
            )
        values.setdefault("condition_entities", [])
        values.setdefault("explicit_target_entities", list(values.get("target_entities", [])))
        values.setdefault("conditions", [])
        values.setdefault("condition_failure", "skip")
        values.setdefault("overdue_policy", None)
        values.setdefault("overdue_grace", None)
        values.setdefault("valid_until", None)
        values.setdefault("terminal_reason", None)
        if (
            not values["terminal_reason"]
            and values.get("last_error")
            and values.get("status") in {"cancelled", "expired", "skipped", "missed"}
        ):
            values["terminal_reason"] = values["last_error"]
            values["last_error"] = None
        if values["condition_failure"] not in {"skip", "cancel", "fail"}:
            raise InvalidConditionError("Stored condition_failure is invalid")
        if values["overdue_policy"] not in {
            None,
            "execute",
            "skip",
            "execute_within_grace",
        }:
            raise InvalidTimeError("Stored overdue_policy is invalid")
        if values["valid_until"] and values["valid_until"] <= values["execute_at"]:
            raise InvalidTimeError("Stored valid_until must be after execute_at")
        values["status"] = JobStatus(values["status"])
        return cls(**values)

    def public_dict(self, local_tz: Any, now: datetime | None = None) -> dict[str, Any]:
        """Return JSON-safe public data with UTC and local time."""
        current = now or utc_now()
        data = self.to_storage()
        data["execute_at"] = self.execute_at.isoformat().replace("+00:00", "Z")
        data["execute_at_local"] = self.execute_at.astimezone(local_tz).isoformat()
        data["valid_until"] = (
            self.valid_until.isoformat().replace("+00:00", "Z") if self.valid_until else None
        )
        data["valid_until_local"] = (
            self.valid_until.astimezone(local_tz).isoformat() if self.valid_until else None
        )
        data["seconds_remaining"] = max(0, int((self.execute_at - current).total_seconds()))
        data["action_summary"] = summarize_sequence(self.sequence)
        data["has_conditions"] = bool(self.conditions)
        return data


def _literal_entities(value: Any) -> list[str]:
    """Return literal entity IDs without attempting to render templates."""
    candidates = [value] if isinstance(value, str) else value if isinstance(value, list) else []
    return [
        item
        for item in candidates
        if isinstance(item, str) and "." in item and "{{" not in item and "{%" not in item
    ]


def extract_entity_ids(config: Any) -> list[str]:
    """Walk nested Home Assistant config and extract literal entity_id values."""
    found: dict[str, None] = {}

    def visit(value: Any) -> None:
        if isinstance(value, dict):
            for key, child in value.items():
                if key == "entity_id":
                    for entity_id in _literal_entities(child):
                        found.setdefault(entity_id, None)
                else:
                    visit(child)
        elif isinstance(value, list):
            for child in value:
                visit(child)

    visit(config)
    return list(found)


def merge_entity_ids(discovered: list[str], explicit: list[str] | None) -> list[str]:
    """Merge discovered entities and explicit hints in deterministic order."""
    return list(dict.fromkeys([*discovered, *(explicit or [])]))


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
