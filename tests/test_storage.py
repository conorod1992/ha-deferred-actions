"""Focused storage quarantine tests."""

from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock

from custom_components.deferred_actions.models import DeferredJob
from custom_components.deferred_actions.storage import DeferredActionsStorage


def _valid_record() -> dict:
    now = datetime(2026, 8, 26, 12, tzinfo=UTC)
    return DeferredJob(
        id="valid",
        name="Valid job",
        execute_at=now,
        sequence=[{"action": "light.turn_off"}],
        created_at=now,
        modified_at=now,
    ).to_storage()


async def test_invalid_record_survives_save_and_restart(hass) -> None:
    invalid = {"id": "broken", "name": "Broken", "sequence": "not-a-list"}
    first = DeferredActionsStorage(hass)
    first_store = MagicMock()
    first_store.async_load = AsyncMock(
        return_value={"schema_version": 1, "jobs": [_valid_record(), invalid]}
    )
    first_store.async_save = AsyncMock()
    first._store = first_store

    jobs, diagnostics = await first.async_load()
    assert list(jobs) == ["valid"]
    assert len(diagnostics) == 1
    assert diagnostics[0]["record_id"] == "broken"

    await first.async_save(jobs)
    saved = first_store.async_save.await_args.args[0]
    assert saved["jobs"][1] == invalid

    second = DeferredActionsStorage(hass)
    second_store = MagicMock()
    second_store.async_load = AsyncMock(return_value=saved)
    second._store = second_store
    restarted_jobs, restarted_diagnostics = await second.async_load()
    assert list(restarted_jobs) == ["valid"]
    assert restarted_diagnostics[0]["record_id"] == "broken"
