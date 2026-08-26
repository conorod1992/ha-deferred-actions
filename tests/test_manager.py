"""Scheduler, operations, races, overdue and persistence tests."""

import asyncio
from contextlib import suppress
from datetime import datetime, timedelta
from unittest.mock import AsyncMock, patch

import pytest

from custom_components.deferred_actions.manager import DeferredActionsManager
from custom_components.deferred_actions.models import (
    BulkConfirmationError,
    ConflictError,
    InvalidStatusError,
    InvalidTimeError,
    JobStatus,
    ManagerUnavailableError,
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
    assert manager.jobs[one["id"]].last_error == "missing entity"
    assert manager.jobs[one["id"]].terminal_reason is None


async def test_due_execution_is_durable_before_action_starts(manager) -> None:
    job = await create(manager)
    manager.jobs[job["id"]].execute_at = utc_now() - timedelta(seconds=1)
    manager._storage.async_save.reset_mock()
    manager._storage.async_delay_save.reset_mock()

    async def assert_claim_saved(_hass, stored_job) -> None:
        assert manager._storage.async_save.await_count == 1
        assert stored_job.status == JobStatus.EXECUTING

    with patch(
        "custom_components.deferred_actions.manager.async_execute_job",
        AsyncMock(side_effect=assert_claim_saved),
    ):
        await manager._async_due_callback(utc_now())

    assert manager._storage.async_save.await_count == 2
    manager._storage.async_delay_save.assert_not_awaited()


async def test_create_is_durably_saved_before_return(manager) -> None:
    manager._storage.async_save.reset_mock()
    manager._storage.async_delay_save.reset_mock()
    await create(manager)
    manager._storage.async_save.assert_awaited_once()
    manager._storage.async_delay_save.assert_not_awaited()


async def test_unload_cancels_owned_in_flight_execution(manager) -> None:
    job = await create(manager)
    started = asyncio.Event()
    cancelled = asyncio.Event()

    async def wait_forever(_hass, _job) -> None:
        started.set()
        try:
            await asyncio.Event().wait()
        except asyncio.CancelledError:
            cancelled.set()
            raise

    with patch(
        "custom_components.deferred_actions.manager.async_execute_job",
        AsyncMock(side_effect=wait_forever),
    ):
        execution = asyncio.create_task(manager.async_execute_now(job["id"]))
        await started.wait()
        await manager.async_unload()
        with suppress(asyncio.CancelledError):
            await execution

    assert cancelled.is_set()
    assert not manager.available
    assert manager.jobs[job["id"]].status == JobStatus.EXECUTING


async def test_owned_work_cannot_register_after_unload(manager) -> None:
    ran = False

    async def work() -> None:
        nonlocal ran
        ran = True

    assert await manager.async_unload()
    with pytest.raises(ManagerUnavailableError):
        await manager.async_run_owned(work(), "rejected work")
    assert not ran


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


async def test_conflicts_include_paused_and_all_same_key_matches(manager) -> None:
    first = await create(manager, job_key="heater", conflict_mode="keep_all")
    second = await create(manager, job_key="heater", conflict_mode="keep_all")
    await manager.async_pause(first["id"])

    with pytest.raises(ConflictError):
        await create(manager, job_key="heater", conflict_mode="reject_same_key")

    replaced = await create(
        manager, name="Replacement", job_key="heater", conflict_mode="replace_same_key"
    )
    assert replaced["id"] == second["id"]
    assert manager.jobs[first["id"]].status == JobStatus.CANCELLED
    assert manager.jobs[second["id"]].status == JobStatus.PENDING


async def test_reject_same_key_is_rechecked_at_commit(manager) -> None:
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
        prepared = await manager.async_prepare_create(
            name="Rejecting create",
            sequence=[{"action": "light.turn_off"}],
            delay={"minutes": 10},
            job_key="heater",
            conflict_mode="reject_same_key",
        )
    competing = await create(
        manager,
        name="Competing create",
        job_key="heater",
        conflict_mode="keep_all",
    )

    with pytest.raises(ConflictError):
        await manager.async_commit_create(prepared)

    assert list(manager.jobs) == [competing["id"]]
    assert manager.jobs[competing["id"]].status == JobStatus.PENDING
    assert "heater" not in manager._create_reservations


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
    if mode == "fail":
        assert result["last_error"] == "Execution conditions were false"
        assert result["terminal_reason"] is None
    else:
        assert result["last_error"] is None
        assert result["terminal_reason"] == "Execution conditions were false"


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
    assert stored.last_error is None
    assert stored.terminal_reason == "Validity cutoff passed before execution began"
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


async def test_sequence_edit_replaces_discovered_targets_and_preserves_explicit_hints(
    manager,
) -> None:
    job = await create(
        manager,
        sequence=[{"action": "light.turn_off", "target": {"entity_id": "light.office"}}],
        target_entities=["switch.dynamic_hint"],
    )
    with patch(
        "custom_components.deferred_actions.manager.async_validate_sequence",
        AsyncMock(side_effect=lambda _hass, value: value),
    ):
        updated = await manager.async_update(
            job["id"],
            sequence=[{"action": "light.turn_off", "target": {"entity_id": "light.bedroom"}}],
        )
    assert updated["target_entities"] == ["light.bedroom", "switch.dynamic_hint"]
    assert updated["explicit_target_entities"] == ["switch.dynamic_hint"]
    assert "light.office" not in updated["target_entities"]

    cleared = await manager.async_update(job["id"], target_entities=[])
    assert cleared["target_entities"] == ["light.bedroom"]
    assert cleared["explicit_target_entities"] == []


async def test_update_clears_nullable_overrides(manager) -> None:
    execute_at = utc_now() + timedelta(hours=1)
    job = await create(
        manager,
        delay=None,
        execute_at=execute_at.isoformat(),
        valid_until=(execute_at + timedelta(minutes=30)).isoformat(),
        overdue_policy="execute_within_grace",
        overdue_grace={"minutes": 5},
        conditions=[{"condition": "state", "entity_id": "switch.ready", "state": "on"}],
        target_entities=["switch.dynamic_hint"],
    )
    with patch(
        "custom_components.deferred_actions.manager.async_validate_conditions",
        AsyncMock(return_value=[]),
    ):
        updated = await manager.async_update(
            job["id"],
            valid_until=None,
            overdue_policy=None,
            overdue_grace=None,
            conditions=[],
            target_entities=[],
        )
    assert updated["valid_until"] is None
    assert updated["overdue_policy"] is None
    assert updated["overdue_grace"] is None
    assert updated["conditions"] == []
    assert updated["condition_entities"] == []
    assert updated["explicit_target_entities"] == []


@pytest.mark.parametrize(
    "changes",
    [
        {"name": "   "},
        {"tags": "not-a-list"},
        {"tags": ["ok", 4]},
        {"target_entities": "light.office"},
        {"target_entities": ["not an entity"]},
        {"description": 42},
        {"job_key": ["bad"]},
        {"unknown": True},
    ],
)
async def test_update_rejects_malformed_fields_without_mutation(manager, changes) -> None:
    job = await create(manager)
    with pytest.raises(ValueError):
        await manager.async_update(job["id"], **changes)
    assert manager.jobs[job["id"]].revision == 1


async def test_valid_until_remains_consistent_during_edits(manager) -> None:
    execute_at = utc_now() + timedelta(hours=1)
    cutoff = execute_at + timedelta(minutes=30)
    job = await create(
        manager,
        delay=None,
        execute_at=execute_at.isoformat(),
        valid_until=cutoff.isoformat(),
    )
    with pytest.raises(InvalidTimeError):
        await manager.async_reschedule(
            job["id"], execute_at=(cutoff + timedelta(minutes=1)).isoformat()
        )
    with pytest.raises(InvalidTimeError):
        await manager.async_update(job["id"], valid_until=execute_at.isoformat())

    unchanged = await manager.async_update(job["id"], name="Renamed")
    assert unchanged["valid_until"] == cutoff.isoformat().replace("+00:00", "Z")
    cleared = await manager.async_update(job["id"], valid_until=None)
    assert cleared["valid_until"] is None


@pytest.mark.parametrize("status", [JobStatus.COMPLETED, JobStatus.EXPIRED])
async def test_duplicate_preserves_relative_validity_window(manager, status) -> None:
    original_execute_at = utc_now() + timedelta(hours=1)
    original = await create(
        manager,
        delay=None,
        execute_at=original_execute_at.isoformat(),
        valid_until=(original_execute_at + timedelta(minutes=30)).isoformat(),
    )
    stored = manager.jobs[original["id"]]
    stored.status = status
    if status == JobStatus.EXPIRED:
        stored.execute_at = utc_now() - timedelta(hours=2)
        stored.valid_until = stored.execute_at + timedelta(minutes=30)

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
        duplicate = await manager.async_duplicate(original["id"], delay={"hours": 3})

    duplicate_execute_at = datetime.fromisoformat(duplicate["execute_at"].replace("Z", "+00:00"))
    duplicate_valid_until = datetime.fromisoformat(duplicate["valid_until"].replace("Z", "+00:00"))
    assert duplicate_valid_until - duplicate_execute_at == timedelta(minutes=30)
    assert stored.status == status


async def test_duplicate_without_valid_until_remains_without_expiry(manager) -> None:
    original = await create(manager)
    manager.jobs[original["id"]].status = JobStatus.CANCELLED
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
        duplicate = await manager.async_duplicate(original["id"], delay={"minutes": 15})
    assert duplicate["valid_until"] is None


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
        with pytest.raises(UnsafeActionError, match="literal entity IDs"):
            await manager.async_create_safe(
                name="Malformed target",
                action="light.turn_on",
                target_entities=["light.office\nlight.bedroom"],
                delay={"minutes": 5},
            )
        with pytest.raises(UnsafeActionError, match="unsupported fields"):
            await manager.async_create_safe(
                name="Nested condition",
                action="light.turn_on",
                target_entities=["light.one"],
                conditions=[
                    {
                        "condition": "state",
                        "entity_id": "switch.ready",
                        "state": "on",
                        "sequence": [{"action": "light.turn_off"}],
                    }
                ],
                delay={"minutes": 5},
            )
        with pytest.raises(UnsafeActionError, match="literal entity IDs"):
            await manager.async_create_safe(
                name="Templated condition",
                action="light.turn_on",
                target_entities=["light.one"],
                conditions=[
                    {
                        "condition": "state",
                        "entity_id": "{{ dynamic_entity }}",
                        "state": "on",
                    }
                ],
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
