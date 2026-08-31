"""Queue snapshot and history-cleanup synchronization tests."""

from datetime import timedelta
from unittest.mock import AsyncMock, patch

import pytest

from custom_components.deferred_actions.manager import DeferredActionsManager
from custom_components.deferred_actions.models import JobStatus, utc_now


@pytest.fixture
async def manager(hass, mock_storage):
    item = DeferredActionsManager(hass, {})
    await item.async_initialize()
    yield item
    await item.async_unload()


async def create(manager, name):
    with (
        patch(
            "custom_components.deferred_actions.manager.async_validate_sequence",
            AsyncMock(side_effect=lambda _hass, value: value),
        ),
        patch(
            "custom_components.deferred_actions.manager.async_validate_conditions",
            AsyncMock(side_effect=lambda _hass, value: value or []),
        ),
    ):
        return await manager.async_create(
            name=name,
            delay={"minutes": 20},
            sequence=[{"action": "light.turn_off"}],
        )


async def test_list_can_return_complete_queue_snapshot(manager) -> None:
    for index in range(3):
        await create(manager, f"Job {index}")

    result = manager.async_list(limit=None)

    assert result["count"] == 3
    assert len(result["jobs"]) == 3
    assert result["more"] is False


async def test_automatic_history_cleanup_notifies_subscribers(manager) -> None:
    job = await create(manager, "Old history")
    stored = manager.jobs[job["id"]]
    stored.status = JobStatus.COMPLETED
    stored.completed_at = utc_now() - timedelta(days=10)
    stored.modified_at = stored.completed_at
    manager.update_options({"history_retention_days": 1})
    events = []
    manager.async_subscribe(events.append)

    result = await manager.async_cleanup_history()

    assert result == {"deleted_count": 1}
    assert job["id"] not in manager.jobs
    assert any(event == {"event": "history_cleaned", "count": 1} for event in events)
    assert any(event["event"] == "queue_summary" for event in events)
