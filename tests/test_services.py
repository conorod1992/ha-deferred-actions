"""Focused service-schema validation tests."""

from datetime import UTC, datetime

import pytest
import voluptuous as vol

from custom_components.deferred_actions.services import SERVICE_SCHEMAS


def test_create_schema_rejects_malformed_timestamp_and_duration() -> None:
    base = {"name": "Test", "sequence": [{"action": "light.turn_off"}]}
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["create"]({**base, "execute_at": 123})
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["create"]({**base, "valid_until": {"hour": 12}})
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["create"]({**base, "delay": {"minutes": -1}})
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["create"]({**base, "delay": {"fortnights": 1}})

    validated = SERVICE_SCHEMAS["create"]({**base, "execute_at": datetime(2026, 8, 9, tzinfo=UTC)})
    assert isinstance(validated["execute_at"], datetime)


def test_update_schema_accepts_explicitly_cleared_overrides() -> None:
    validated = SERVICE_SCHEMAS["update"](
        {
            "job_id": "job-id",
            "conditions": [],
            "overdue_policy": None,
            "overdue_grace": None,
            "valid_until": None,
            "target_entities": [],
        }
    )
    assert validated["conditions"] == []
    assert validated["overdue_policy"] is None
    assert validated["overdue_grace"] is None
    assert validated["valid_until"] is None
    assert validated["target_entities"] == []


def test_snooze_schema_rejects_malformed_duration() -> None:
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["snooze"]({"job_id": "job-id", "duration": {"minutes": "later"}})
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["snooze"]({"job_id": "job-id", "duration": {"minutes": 5, "extra": 1}})
