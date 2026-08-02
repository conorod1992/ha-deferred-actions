"""Model, storage-format and summary tests."""

from datetime import UTC, datetime

import pytest

from custom_components.deferred_actions.models import (
    DeferredJob,
    InvalidTimeError,
    JobStatus,
    ensure_utc,
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
