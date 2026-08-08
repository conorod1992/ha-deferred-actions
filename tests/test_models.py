"""Model, storage-format and summary tests."""

from datetime import UTC, datetime

import pytest

from custom_components.deferred_actions.models import (
    DeferredJob,
    InvalidTimeError,
    JobStatus,
    ensure_utc,
    extract_entity_ids,
    merge_entity_ids,
    summarize_sequence,
)


def test_storage_round_trip() -> None:
    now = datetime(2026, 8, 2, 18, tzinfo=UTC)
    job = DeferredJob(
        id="one",
        name="Porch",
        execute_at=now,
        sequence=[{"action": "light.turn_on"}],
        created_at=now,
        modified_at=now,
        status=JobStatus.PAUSED,
        tags=["outside"],
    )
    assert DeferredJob.from_storage(job.to_storage()) == job


def test_public_data_is_json_safe() -> None:
    now = datetime(2026, 8, 2, 18, tzinfo=UTC)
    job = DeferredJob(
        id="one",
        name="Porch",
        execute_at=now,
        sequence=[{"action": "light.turn_on"}],
        created_at=now,
        modified_at=now,
    )
    result = job.public_dict(UTC, now)
    assert result["execute_at"] == "2026-08-02T18:00:00Z"
    assert result["seconds_remaining"] == 0
    assert result["status"] == "pending"


def test_naive_time_rejected() -> None:
    with pytest.raises(InvalidTimeError):
        ensure_utc(datetime(2026, 8, 2, 18))


@pytest.mark.parametrize(
    ("sequence", "expected"),
    [
        (
            [{"action": "switch.turn_off", "target": {"entity_id": "switch.office_heater"}}],
            "Turn off Office Heater",
        ),
        ([{"action": "script.good_night"}], "Run script Good Night"),
        ([{"delay": 1}, {"action": "light.turn_off"}], "Run 2 actions"),
    ],
)
def test_safe_action_summary(sequence, expected) -> None:
    assert summarize_sequence(sequence) == expected


def test_old_storage_record_gets_new_defaults() -> None:
    now = datetime(2026, 8, 2, 18, tzinfo=UTC)
    record = DeferredJob(
        id="old",
        name="Old",
        execute_at=now,
        sequence=[{"action": "light.turn_off"}],
        created_at=now,
        modified_at=now,
    ).to_storage()
    for key in (
        "conditions",
        "condition_failure",
        "condition_entities",
        "explicit_target_entities",
        "overdue_policy",
        "overdue_grace",
        "valid_until",
    ):
        record.pop(key)
    restored = DeferredJob.from_storage(record)
    assert restored.conditions == []
    assert restored.condition_failure == "skip"
    assert restored.overdue_policy is None
    assert restored.valid_until is None


def test_extract_nested_literal_entity_targets() -> None:
    sequence = [
        {"action": "light.turn_off", "target": {"entity_id": ["light.one", "light.two"]}},
        {
            "choose": [
                {
                    "conditions": [],
                    "sequence": [
                        {"action": "switch.turn_off", "target": {"entity_id": "switch.one"}}
                    ],
                }
            ]
        },
        {
            "repeat": {
                "sequence": [
                    {"parallel": [{"action": "fan.turn_off", "target": {"entity_id": "fan.one"}}]}
                ]
            }
        },
        {
            "if": [],
            "then": [{"action": "light.turn_on", "target": {"entity_id": "light.one"}}],
            "else": [{"target": {"entity_id": "{{ dynamic }}"}}],
        },
    ]
    assert extract_entity_ids(sequence) == ["light.one", "light.two", "switch.one", "fan.one"]
    assert merge_entity_ids(extract_entity_ids(sequence), ["cover.hint", "light.one"]) == [
        "light.one",
        "light.two",
        "switch.one",
        "fan.one",
        "cover.hint",
    ]
