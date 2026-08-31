"""Regression tests for durable and atomic scheduler state mutations."""

from datetime import timedelta
from unittest.mock import AsyncMock, patch

import pytest

from custom_components.deferred_actions.manager import DeferredActionsManager
from custom_components.deferred_actions.models import InvalidStatusError, JobStatus, utc_now


@pytest.fixture
async def manager(hass, mock_storage):
    item = DeferredActionsManager(hass, {})
    await item.async_initialize()
    yield item
    await item.async_unload()


async def create(manager, **kwargs):
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
            name=kwargs.pop("name", "Test"),
            delay=kwargs.pop("delay", {"minutes": 20}),
            sequence=kwargs.pop("sequence", [{"action": "light.turn_off"}]),
            **kwargs,
        )


def reset_storage_mocks(manager) -> None:
    manager._storage.async_save.reset_mock()
    manager._storage.async_delay_save.reset_mock()


def assert_immediate_save(manager) -> None:
    manager._storage.async_save.assert_awaited_once()
    manager._storage.async_delay_save.assert_not_awaited()


async def test_due_claim_storage_failure_rolls_back_without_start(manager) -> None:
    job = await create(manager)
    stored = manager.jobs[job["id"]]
    stored.execute_at = utc_now() + timedelta(minutes=5)
    scheduled_for = stored.execute_at
    revision = stored.revision
    execute = AsyncMock()
    reset_storage_mocks(manager)
    manager._storage.async_save.side_effect = OSError("storage unavailable")
    try:
        with (
            patch("custom_components.deferred_actions.manager.async_execute_job", execute),
            pytest.raises(OSError, match="storage unavailable"),
        ):
            await manager._async_due_callback(scheduled_for + timedelta(seconds=1))
    finally:
        manager._storage.async_save.side_effect = None

    current = manager.jobs[job["id"]]
    assert current.status == JobStatus.PENDING
    assert current.revision == revision
    assert current.execute_at == scheduled_for
    assert manager.scheduler_active
    execute.assert_not_awaited()


async def test_execute_now_claim_storage_failure_rolls_back_without_action(manager) -> None:
    job = await create(manager)
    execute = AsyncMock()
    reset_storage_mocks(manager)
    manager._storage.async_save.side_effect = OSError("storage unavailable")
    try:
        with (
            patch("custom_components.deferred_actions.manager.async_execute_job", execute),
            pytest.raises(OSError, match="storage unavailable"),
        ):
            await manager.async_execute_now(job["id"])
    finally:
        manager._storage.async_save.side_effect = None

    current = manager.jobs[job["id"]]
    assert current.status == JobStatus.PENDING
    assert current.revision == job["revision"]
    assert manager.scheduler_active
    execute.assert_not_awaited()


async def test_safety_critical_mutations_are_durable_before_return(manager) -> None:
    job = await create(manager)

    reset_storage_mocks(manager)
    await manager.async_update(job["id"], name="Renamed")
    assert_immediate_save(manager)

    reset_storage_mocks(manager)
    await manager.async_reschedule(job["id"], delay={"minutes": 30})
    assert_immediate_save(manager)

    reset_storage_mocks(manager)
    await manager.async_extend(job["id"], {"minutes": 5})
    assert_immediate_save(manager)

    reset_storage_mocks(manager)
    await manager.async_snooze(job["id"], {"minutes": 5})
    assert_immediate_save(manager)

    reset_storage_mocks(manager)
    await manager.async_pause(job["id"])
    assert_immediate_save(manager)

    reset_storage_mocks(manager)
    await manager.async_resume(job["id"], delay={"minutes": 40})
    assert_immediate_save(manager)

    reset_storage_mocks(manager)
    await manager.async_cancel(job["id"])
    assert_immediate_save(manager)

    second = await create(manager)
    reset_storage_mocks(manager)
    await manager.async_delete(second["id"])
    assert_immediate_save(manager)


async def test_cancel_storage_failure_restores_pending_job(manager) -> None:
    job = await create(manager)
    reset_storage_mocks(manager)
    manager._storage.async_save.side_effect = OSError("storage unavailable")
    try:
        with pytest.raises(OSError, match="storage unavailable"):
            await manager.async_cancel(job["id"])
    finally:
        manager._storage.async_save.side_effect = None

    current = manager.jobs[job["id"]]
    assert current.status == JobStatus.PENDING
    assert current.revision == job["revision"]
    assert manager.scheduler_active


async def test_delete_storage_failure_restores_job(manager) -> None:
    job = await create(manager)
    reset_storage_mocks(manager)
    manager._storage.async_save.side_effect = OSError("storage unavailable")
    try:
        with pytest.raises(OSError, match="storage unavailable"):
            await manager.async_delete(job["id"])
    finally:
        manager._storage.async_save.side_effect = None

    current = manager.jobs[job["id"]]
    assert current.status == JobStatus.PENDING
    assert current.revision == job["revision"]
    assert manager.scheduler_active


@pytest.mark.parametrize(
    "statuses",
    [
        ["pending"],
        ["paused"],
        ["executing"],
        ["completed", "pending"],
    ],
)
async def test_delete_history_rejects_any_active_status(manager, statuses) -> None:
    job = await create(manager)
    reset_storage_mocks(manager)

    with pytest.raises(InvalidStatusError, match="only accepts history statuses"):
        await manager.async_delete_history(confirm_bulk=True, statuses=statuses)

    assert job["id"] in manager.jobs
    manager._storage.async_save.assert_not_awaited()
    manager._storage.async_delay_save.assert_not_awaited()


async def test_delete_history_is_durable_and_rolls_back_on_failure(manager) -> None:
    first = await create(manager)
    stored = manager.jobs[first["id"]]
    stored.status = JobStatus.COMPLETED
    stored.completed_at = utc_now()
    stored.modified_at = stored.completed_at
    manager._async_reschedule_locked()

    reset_storage_mocks(manager)
    result = await manager.async_delete_history(confirm_bulk=True, statuses=["completed"])
    assert result["deleted_count"] == 1
    assert first["id"] not in manager.jobs
    assert_immediate_save(manager)

    second = await create(manager)
    stored = manager.jobs[second["id"]]
    stored.status = JobStatus.COMPLETED
    stored.completed_at = utc_now()
    stored.modified_at = stored.completed_at
    manager._async_reschedule_locked()

    reset_storage_mocks(manager)
    manager._storage.async_save.side_effect = OSError("storage unavailable")
    try:
        with pytest.raises(OSError, match="storage unavailable"):
            await manager.async_delete_history(confirm_bulk=True, statuses=["completed"])
    finally:
        manager._storage.async_save.side_effect = None

    assert second["id"] in manager.jobs
    assert manager.jobs[second["id"]].status == JobStatus.COMPLETED


async def test_cancel_all_is_one_atomic_durable_mutation(manager) -> None:
    first = await create(manager, name="First", tags=["bulk"])
    second = await create(manager, name="Second", tags=["bulk"])
    executing = await create(manager, name="Already running", tags=["bulk"])
    manager.jobs[executing["id"]].status = JobStatus.EXECUTING
    manager._async_reschedule_locked()

    reset_storage_mocks(manager)
    result = await manager.async_cancel_all(confirm_bulk=True, tag="bulk")

    assert result["count"] == 2
    assert manager.jobs[first["id"]].status == JobStatus.CANCELLED
    assert manager.jobs[second["id"]].status == JobStatus.CANCELLED
    assert manager.jobs[executing["id"]].status == JobStatus.EXECUTING
    assert_immediate_save(manager)


async def test_cancel_all_storage_failure_restores_every_job(manager) -> None:
    first = await create(manager, name="First", tags=["bulk"])
    second = await create(manager, name="Second", tags=["bulk"])
    reset_storage_mocks(manager)
    manager._storage.async_save.side_effect = OSError("storage unavailable")
    try:
        with pytest.raises(OSError, match="storage unavailable"):
            await manager.async_cancel_all(confirm_bulk=True, tag="bulk")
    finally:
        manager._storage.async_save.side_effect = None

    assert manager.jobs[first["id"]].status == JobStatus.PENDING
    assert manager.jobs[second["id"]].status == JobStatus.PENDING
    assert manager.jobs[first["id"]].revision == first["revision"]
    assert manager.jobs[second["id"]].revision == second["revision"]
    assert manager.scheduler_active
