"""Scheduler, operations, races, overdue and persistence tests."""

from datetime import datetime, timedelta
from unittest.mock import AsyncMock, patch

import pytest

from custom_components.deferred_actions.manager import DeferredActionsManager
from custom_components.deferred_actions.models import (
    BulkConfirmationError,
    InvalidStatusError,
    InvalidTimeError,
    JobStatus,
    RevisionConflictError,
    utc_now,
)


@pytest.fixture
async def manager(hass, mock_storage):
    item = DeferredActionsManager(hass, {})
    await item.async_initialize()
    yield item
    await item.async_unload()


async def create(manager, **kwargs):
    with patch(
        "custom_components.deferred_actions.manager.async_validate_sequence",
        AsyncMock(side_effect=lambda _hass, value: value),
    ):
        return await manager.async_create(
            name=kwargs.pop("name", "Test"),
            delay=kwargs.pop("delay", {"minutes": 20}),
            sequence=kwargs.pop("sequence", [{"action": "light.turn_off"}]),
            **kwargs,
        )


async def test_multiple_jobs_and_earliest_schedule(manager) -> None:
    first = await create(manager, delay={"minutes": 30})
    second = await create(manager, delay={"minutes": 10})
    assert manager.summary()["pending"] == 2
    assert manager.summary()["next_job_id"] == second["id"]
    assert first["id"] != second["id"]
    assert manager.scheduler_active


async def test_cancel_pause_resume_and_delete(manager) -> None:
    job = await create(manager)
    paused = await manager.async_pause(job["id"])
    assert paused["status"] == "paused"
    assert manager.summary()["pending"] == 0
    resumed = await manager.async_resume(job["id"], delay={"minutes": 30})
    assert resumed["status"] == "pending"
    cancelled = await manager.async_cancel(job["id"])
    assert cancelled["status"] == "cancelled"
    deleted = await manager.async_delete(job["id"])
    assert deleted["deleted"]["id"] == job["id"]


async def test_revision_conflict(manager) -> None:
    job = await create(manager)
    await manager.async_update(job["id"], expected_revision=1, name="Changed")
    with pytest.raises(RevisionConflictError):
        await manager.async_update(job["id"], expected_revision=1, name="Stale")


async def test_reschedule_and_signed_extend(manager) -> None:
    job = await create(manager)
    future = (utc_now() + timedelta(hours=2)).isoformat()
    moved = await manager.async_reschedule(job["id"], execute_at=future)
    shortened = await manager.async_extend(job["id"], {"minutes": -5})
    assert datetime.fromisoformat(
        shortened["execute_at"].replace("Z", "+00:00")
    ) < datetime.fromisoformat(moved["execute_at"].replace("Z", "+00:00"))
    with pytest.raises(InvalidTimeError):
        await manager.async_extend(job["id"], {"days": -99})


async def test_execute_now_claims_once(manager) -> None:
    job = await create(manager)
    gate = AsyncMock()
    with patch("custom_components.deferred_actions.manager.async_execute_job", gate):
        result = await manager.async_execute_now(job["id"])
    assert result["status"] == "completed"
    gate.assert_awaited_once()
    with pytest.raises(InvalidStatusError):
        await manager.async_execute_now(job["id"])


async def test_due_jobs_execute_independently(manager) -> None:
    one = await create(manager)
    two = await create(manager)
    for job in manager.jobs.values():
        job.execute_at = utc_now() - timedelta(seconds=1)
    execute = AsyncMock(side_effect=[RuntimeError("missing entity"), None])
    with patch("custom_components.deferred_actions.manager.async_execute_job", execute):
        await manager._async_due_callback(utc_now())
    assert manager.jobs[one["id"]].status == JobStatus.FAILED
    assert manager.jobs[two["id"]].status == JobStatus.COMPLETED


async def test_bulk_requires_confirmation_and_selector(manager) -> None:
    await create(manager)
    with pytest.raises(BulkConfirmationError):
        await manager.async_cancel_all(confirm_bulk=False, statuses=["pending"])
    with pytest.raises(BulkConfirmationError):
        await manager.async_cancel_all(confirm_bulk=True)
    result = await manager.async_cancel_all(confirm_bulk=True, statuses=["pending"])
    assert result["count"] == 1


async def test_conflict_modes(manager) -> None:
    first = await create(manager, job_key="heater")
    replaced = await create(
        manager, name="Replacement", job_key="heater", conflict_mode="replace_same_key"
    )
    assert replaced["id"] == first["id"]
    assert replaced["name"] == "Replacement"


async def test_list_filters_and_json_data(manager) -> None:
    await create(
        manager,
        name="Office",
        tags=["heat"],
        source="automation",
        target_entities=["switch.office"],
    )
    await create(manager, name="Bedroom")
    result = manager.async_list(name_query="off", tag="heat", target_entity="switch.office")
    assert result["count"] == 1
    assert isinstance(result["jobs"][0]["execute_at"], str)
