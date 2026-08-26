"""Focused service-schema validation tests."""

import asyncio
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
import voluptuous as vol
from homeassistant.core import SupportsResponse

from custom_components.deferred_actions.manager import DeferredActionsManager
from custom_components.deferred_actions.models import (
    ConflictError,
    InvalidTimeError,
    ManagerUnavailableError,
    utc_now,
)
from custom_components.deferred_actions.services import (
    SERVICE_NAMES,
    SERVICE_SCHEMAS,
    async_register_services,
    async_run_for,
)


@pytest.fixture
async def manager(hass, mock_storage):
    item = DeferredActionsManager(hass, {})
    await item.async_initialize()
    yield item
    await item.async_unload()


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


def test_update_schema_rejects_unknown_and_malformed_fields() -> None:
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["update"]({"job_id": "job-id", "unknown": True})
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["update"]({"job_id": "job-id", "tags": "one-tag"})
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["update"]({"job_id": "job-id", "name": "   "})


async def test_services_support_optional_responses() -> None:
    services = MagicMock()
    services.has_service.return_value = False
    await async_register_services(SimpleNamespace(services=services))
    assert services.async_register.call_count == len(SERVICE_NAMES)
    assert all(
        call.kwargs["supports_response"] == SupportsResponse.OPTIONAL
        for call in services.async_register.call_args_list
    )


async def test_run_for_preflights_failures_before_start(manager) -> None:
    existing = await manager.async_prepare_create(
        name="Existing",
        sequence=[{"action": "light.turn_off"}],
        delay={"minutes": 10},
        job_key="heater",
    )
    await manager.async_commit_create(existing)
    script = MagicMock()
    script.return_value.async_run = AsyncMock()
    validators = AsyncMock(side_effect=lambda _hass, value: value)
    with (
        patch("homeassistant.helpers.script.Script", script),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
        pytest.raises(ConflictError),
    ):
        await async_run_for(
            manager,
            {
                "duration": {"minutes": 5},
                "start_sequence": [{"action": "light.turn_on"}],
                "end_sequence": [{"action": "light.turn_off"}],
                "job_key": "heater",
                "conflict_mode": "reject_same_key",
            },
            attribution={"source": "service"},
        )
    script.assert_not_called()

    with (
        patch("homeassistant.helpers.script.Script", script),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
        pytest.raises(InvalidTimeError),
    ):
        await async_run_for(
            manager,
            {
                "duration": {"minutes": 0},
                "start_sequence": [{"action": "light.turn_on"}],
                "end_sequence": [{"action": "light.turn_off"}],
            },
            attribution={"source": "service"},
        )
    script.assert_not_called()


async def test_run_for_start_failure_leaves_no_job_and_success_commits(manager) -> None:
    validators = AsyncMock(side_effect=lambda _hass, value: value)
    failing_script = MagicMock()
    failing_script.return_value.async_run = AsyncMock(side_effect=RuntimeError("start failed"))
    data = {
        "duration": {"minutes": 5},
        "start_sequence": [{"action": "light.turn_on"}],
        "end_sequence": [{"action": "light.turn_off"}],
        "job_key": "run-for",
    }
    with (
        patch("homeassistant.helpers.script.Script", failing_script),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
        pytest.raises(RuntimeError, match="start failed"),
    ):
        await async_run_for(manager, data, attribution={"source": "service"})
    assert not manager.jobs

    successful_script = MagicMock()
    successful_script.return_value.async_run = AsyncMock()
    with (
        patch("homeassistant.helpers.script.Script", successful_script),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
    ):
        result = await async_run_for(manager, data, attribution={"source": "service"})
    execute_at = datetime.fromisoformat(result["execute_at"].replace("Z", "+00:00"))
    assert result["sequence"] == data["end_sequence"]
    assert result["linkage"]["operation"] == "run_for"
    assert utc_now() < execute_at < utc_now() + timedelta(minutes=6)


async def test_run_for_does_not_start_after_unload_begins(manager) -> None:
    prepared = asyncio.Event()
    continue_after_unload = asyncio.Event()
    original_prepare = manager.async_prepare_create

    async def pause_after_prepare(**kwargs):
        result = await original_prepare(**kwargs)
        prepared.set()
        await continue_after_unload.wait()
        return result

    script = MagicMock()
    script.return_value.async_run = AsyncMock()
    validators = AsyncMock(side_effect=lambda _hass, value: value)
    with (
        patch.object(manager, "async_prepare_create", side_effect=pause_after_prepare),
        patch("homeassistant.helpers.script.Script", script),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
    ):
        service_call = asyncio.create_task(
            async_run_for(
                manager,
                {
                    "duration": {"minutes": 5},
                    "start_sequence": [{"action": "light.turn_on"}],
                    "end_sequence": [{"action": "light.turn_off"}],
                    "job_key": "run-for-race",
                },
                attribution={"source": "service"},
            )
        )
        await prepared.wait()
        assert await manager.async_unload()
        continue_after_unload.set()
        with pytest.raises(ManagerUnavailableError):
            await service_call

    script.return_value.async_run.assert_not_called()
    assert not manager.jobs


async def test_run_for_commit_failure_is_surfaced_without_corrupting_other_jobs(manager) -> None:
    validators = AsyncMock(side_effect=lambda _hass, value: value)
    with patch("custom_components.deferred_actions.manager.async_validate_sequence", validators):
        unrelated = await manager.async_create(
            name="Unrelated",
            sequence=[{"action": "light.turn_off"}],
            delay={"minutes": 20},
            job_key="shared-storage-failure",
        )
    script = MagicMock()
    script.return_value.async_run = AsyncMock()
    with (
        patch("homeassistant.helpers.script.Script", script),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
        patch.object(
            manager._storage,
            "async_save",
            AsyncMock(side_effect=OSError("storage unavailable")),
        ),
        pytest.raises(OSError, match="storage unavailable"),
    ):
        await async_run_for(
            manager,
            {
                "duration": {"minutes": 5},
                "start_sequence": [{"action": "light.turn_on"}],
                "end_sequence": [{"action": "light.turn_off"}],
                "job_key": "shared-storage-failure",
                "conflict_mode": "replace_same_key",
            },
            attribution={"source": "service"},
        )

    script.return_value.async_run.assert_awaited_once()
    assert list(manager.jobs) == [unrelated["id"]]
    assert manager.jobs[unrelated["id"]].name == "Unrelated"
    assert manager.jobs[unrelated["id"]].revision == unrelated["revision"]
    assert "shared-storage-failure" not in manager._create_reservations
