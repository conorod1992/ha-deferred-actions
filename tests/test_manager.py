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
    UnsafeActionError,
    utc_now,
)


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


@pytest.mark.parametrize(
    ("mode", "status", "event"),
    [
        ("skip", JobStatus.SKIPPED, "deferred_actions_job_skipped"),
        ("cancel", JobStatus.CANCELLED, "deferred_actions_job_cancelled"),
        ("fail", JobStatus.FAILED, "deferred_actions_job_failed"),
    ],
)
async def test_false_condition_behavior(manager, hass, mode, status, event) -> None:
    job = await create(
        manager,
        conditions=[{"condition": "state", "entity_id": "switch.office", "state": "on"}],
        condition_failure=mode,
    )
    listener = AsyncMock()
    hass.bus.async_listen(event, listener)
    execute = AsyncMock()
    with (
        patch(
            "custom_components.deferred_actions.manager.async_conditions_pass",
            AsyncMock(return_value=False),
        ),
        patch("custom_components.deferred_actions.manager.async_execute_job", execute),
    ):
        result = await manager.async_execute_now(job["id"])
        await hass.async_block_till_done()
    assert result["status"] == status.value
    execute.assert_not_awaited()
    assert listener.await_count == 1


async def test_true_condition_executes_and_execute_now_rechecks(manager) -> None:
    job = await create(
        manager, conditions=[{"condition": "state", "entity_id": "switch.office", "state": "on"}]
    )
    condition_check = AsyncMock(return_value=True)
    execute = AsyncMock()
    with (
        patch("custom_components.deferred_actions.manager.async_conditions_pass", condition_check),
        patch("custom_components.deferred_actions.manager.async_execute_job", execute),
    ):
        result = await manager.async_execute_now(job["id"])
    assert result["status"] == "completed"
    condition_check.assert_awaited_once()
    execute.assert_awaited_once()


async def test_overdue_restart_execution_rechecks_conditions(manager) -> None:
    manager.update_options({"overdue_policy": "execute"})
    job = await create(
        manager,
        conditions=[{"condition": "state", "entity_id": "switch.office", "state": "on"}],
    )
    manager.jobs[job["id"]].execute_at = utc_now() - timedelta(minutes=1)
    execute = AsyncMock()
    with (
        patch(
            "custom_components.deferred_actions.manager.async_conditions_pass",
            AsyncMock(return_value=False),
        ),
        patch("custom_components.deferred_actions.manager.async_execute_job", execute),
    ):
        await manager._async_recover_overdue()
    assert manager.jobs[job["id"]].status == JobStatus.SKIPPED
    execute.assert_not_awaited()


@pytest.mark.parametrize(
    ("global_policy", "job_policy", "expected"),
    [("skip", "execute", JobStatus.COMPLETED), ("execute", "skip", JobStatus.MISSED)],
)
async def test_job_overdue_policy_overrides_global(
    manager, global_policy, job_policy, expected
) -> None:
    manager.update_options({"overdue_policy": global_policy})
    job = await create(manager, overdue_policy=job_policy)
    manager.jobs[job["id"]].execute_at = utc_now() - timedelta(hours=1)
    with (
        patch(
            "custom_components.deferred_actions.manager.async_conditions_pass",
            AsyncMock(return_value=True),
        ),
        patch("custom_components.deferred_actions.manager.async_execute_job", AsyncMock()),
    ):
        await manager._async_recover_overdue()
    assert manager.jobs[job["id"]].status == expected


async def test_job_and_inherited_overdue_grace(manager) -> None:
    manager.update_options({"overdue_policy": "execute_within_grace", "overdue_grace_minutes": 10})
    inherited = await create(manager)
    custom = await create(
        manager, overdue_policy="execute_within_grace", overdue_grace={"minutes": 2}
    )
    manager.jobs[inherited["id"]].execute_at = utc_now() - timedelta(minutes=5)
    manager.jobs[custom["id"]].execute_at = utc_now() - timedelta(minutes=5)
    with (
        patch(
            "custom_components.deferred_actions.manager.async_conditions_pass",
            AsyncMock(return_value=True),
        ),
        patch("custom_components.deferred_actions.manager.async_execute_job", AsyncMock()),
    ):
        await manager._async_recover_overdue()
    assert manager.jobs[inherited["id"]].status == JobStatus.COMPLETED
    assert manager.jobs[custom["id"]].status == JobStatus.MISSED


async def test_invalid_overdue_policy_and_grace(manager) -> None:
    with pytest.raises(InvalidTimeError):
        await create(manager, overdue_policy="later")
    with pytest.raises(InvalidTimeError):
        await create(manager, overdue_grace={"minutes": -1})


async def test_valid_until_validation_and_public_times(manager) -> None:
    execute_at = utc_now() + timedelta(hours=1)
    result = await create(
        manager,
        delay=None,
        execute_at=execute_at.isoformat(),
        valid_until=(execute_at + timedelta(minutes=5)).isoformat(),
    )
    assert result["valid_until"].endswith("Z")
    assert result["valid_until_local"]
    with pytest.raises(InvalidTimeError):
        await create(manager, valid_until="2026-08-09T09:30:00")
    with pytest.raises(InvalidTimeError):
        await create(manager, valid_until=(utc_now() + timedelta(minutes=10)).isoformat())


async def test_expiry_wins_over_due_and_overdue_execution(manager) -> None:
    job = await create(manager, overdue_policy="execute")
    stored = manager.jobs[job["id"]]
    stored.execute_at = utc_now() - timedelta(minutes=2)
    stored.valid_until = utc_now() - timedelta(minutes=1)
    execute = AsyncMock()
    with patch("custom_components.deferred_actions.manager.async_execute_job", execute):
        await manager._async_recover_overdue()
    assert stored.status == JobStatus.EXPIRED
    execute.assert_not_awaited()
    with pytest.raises(InvalidStatusError):
        await manager.async_execute_now(job["id"])


async def test_snooze_durations_revision_status_and_expiry(manager) -> None:
    for minutes in (5, 15, 30, 60):
        job = await create(manager)
        before = datetime.fromisoformat(job["execute_at"].replace("Z", "+00:00"))
        snoozed = await manager.async_snooze(job["id"], {"minutes": minutes})
        after = datetime.fromisoformat(snoozed["execute_at"].replace("Z", "+00:00"))
        assert after - before == timedelta(minutes=minutes)
        assert snoozed["revision"] == job["revision"] + 1
    paused = await create(manager)
    await manager.async_pause(paused["id"])
    with pytest.raises(InvalidStatusError):
        await manager.async_snooze(paused["id"], {"minutes": 5})
    expiring = await create(manager)
    manager.jobs[expiring["id"]].valid_until = manager.jobs[expiring["id"]].execute_at + timedelta(
        minutes=5
    )
    with pytest.raises(InvalidTimeError):
        await manager.async_snooze(expiring["id"], {"minutes": 5})


async def test_discovered_targets_merge_and_search(manager) -> None:
    job = await create(
        manager,
        sequence=[
            {
                "choose": [
                    {
                        "sequence": [
                            {
                                "action": "light.turn_off",
                                "target": {"entity_id": ["light.one", "light.two"]},
                            }
                        ]
                    }
                ]
            }
        ],
        target_entities=["switch.hint", "light.one"],
        conditions=[{"condition": "state", "entity_id": "binary_sensor.ready", "state": "on"}],
    )
    assert job["target_entities"] == ["light.one", "light.two", "switch.hint"]
    assert manager.resolve(target_entity="binary_sensor.ready").id == job["id"]


async def test_safe_create_allow_block_templates_and_attribution(manager) -> None:
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
        job = await manager.async_create_safe(
            name="Office light",
            action="light.turn_off",
            target_entities=["light.office"],
            delay={"minutes": 5},
            data={"transition": 1},
            attribution={"source": "voice"},
        )
        assert job["source"] == "safe_service"
        assert job["attribution"]["interface"] == "create_safe"
        manager.update_options({"safe_allowed_domains": ["light"], "safe_blocked_actions": []})
        with pytest.raises(UnsafeActionError, match="not enabled"):
            await manager.async_create_safe(
                name="Switch",
                action="switch.turn_off",
                target_entities=["switch.one"],
                delay={"minutes": 5},
            )
        manager.update_options(
            {"safe_allowed_domains": ["light"], "safe_blocked_actions": ["light.turn_off"]}
        )
        with pytest.raises(UnsafeActionError, match="explicitly blocked"):
            await manager.async_create_safe(
                name="Blocked",
                action="light.turn_off",
                target_entities=["light.one"],
                delay={"minutes": 5},
            )
        with pytest.raises(UnsafeActionError, match="templates"):
            await manager.async_create_safe(
                name="Template",
                action="light.turn_on",
                target_entities=["light.one"],
                data={"brightness": "{{ 1 }}"},
                delay={"minutes": 5},
            )
        with pytest.raises(UnsafeActionError, match="fields are not accepted"):
            await manager.async_create_safe(
                name="Sequence",
                action="light.turn_on",
                target_entities=["light.one"],
                sequence=[],
                delay={"minutes": 5},
            )
