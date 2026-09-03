"""Regression tests for replacement provenance and run-for timing."""

import asyncio
from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock, call, patch

import pytest

from custom_components.deferred_actions.manager import DeferredActionsManager
from custom_components.deferred_actions.services import async_run_for


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


async def test_replace_same_key_refreshes_provenance(manager) -> None:
    first = await create(
        manager,
        name="Original",
        job_key="shared-key",
        source="automation",
        attribution={"source": "automation", "request": "old"},
        linkage={"operation": "original"},
    )

    replacement_attribution = {"source": "service", "request": "new"}
    replacement_linkage = {
        "operation": "run_for",
        "start_action": "light.turn_on",
        "end_action": "light.turn_off",
    }
    replaced = await create(
        manager,
        name="Replacement",
        job_key="shared-key",
        conflict_mode="replace_same_key",
        source="service",
        attribution=replacement_attribution,
        linkage=replacement_linkage,
    )

    assert replaced["id"] == first["id"]
    assert replaced["created_at"] == first["created_at"]
    assert replaced["source"] == "service"
    assert replaced["attribution"] == replacement_attribution
    assert replaced["linkage"] == replacement_linkage


async def test_run_for_rebases_duration_after_start_sequence(manager) -> None:
    duration = {"minutes": 5}
    preflight_execute_at = datetime(2026, 8, 31, 12, 5, tzinfo=UTC)
    rebased_execute_at = datetime(2026, 8, 31, 12, 7, tzinfo=UTC)
    calculate_time = MagicMock(side_effect=[preflight_execute_at, rebased_execute_at])
    validators = AsyncMock(side_effect=lambda _hass, value: value)
    script = MagicMock()

    async def run_start(*_args, **_kwargs) -> None:
        assert calculate_time.call_count == 1
        assert not manager.jobs

    script.return_value.async_run = AsyncMock(side_effect=run_start)

    with (
        patch.object(manager, "_calculate_time", calculate_time),
        patch("homeassistant.helpers.script.Script", script),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
    ):
        result = await async_run_for(
            manager,
            {
                "duration": duration,
                "start_sequence": [{"action": "light.turn_on"}],
                "end_sequence": [{"action": "light.turn_off"}],
                "job_key": "run-for-timing",
            },
            attribution={"source": "service"},
        )

    assert calculate_time.call_args_list == [call(None, duration), call(None, duration)]
    assert result["execute_at"] == "2026-08-31T12:07:00Z"


async def test_run_for_compensates_when_commit_fails(manager) -> None:
    validators = AsyncMock(side_effect=lambda _hass, value: value)
    start_script = MagicMock()
    start_script.async_run = AsyncMock()
    end_script = MagicMock()
    end_script.async_run = AsyncMock()
    script_factory = MagicMock(side_effect=[start_script, end_script])

    with (
        patch("homeassistant.helpers.script.Script", script_factory),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
        patch.object(
            manager,
            "async_commit_create",
            AsyncMock(side_effect=OSError("storage unavailable")),
        ),
    ):
        with pytest.raises(OSError, match="storage unavailable"):
            await async_run_for(
                manager,
                {
                    "duration": {"minutes": 5},
                    "start_sequence": [{"action": "light.turn_on"}],
                    "end_sequence": [{"action": "light.turn_off"}],
                    "job_key": "run-for-storage-failure",
                },
                attribution={"source": "service"},
            )

    start_script.async_run.assert_awaited_once()
    end_script.async_run.assert_awaited_once()
    assert not manager._create_reservations


async def test_run_for_compensates_when_start_is_cancelled(manager) -> None:
    validators = AsyncMock(side_effect=lambda _hass, value: value)
    start_script = MagicMock()
    start_script.async_run = AsyncMock(side_effect=asyncio.CancelledError)
    end_script = MagicMock()
    end_script.async_run = AsyncMock()
    script_factory = MagicMock(side_effect=[start_script, end_script])

    with (
        patch("homeassistant.helpers.script.Script", script_factory),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
    ):
        with pytest.raises(asyncio.CancelledError):
            await async_run_for(
                manager,
                {
                    "duration": {"minutes": 5},
                    "start_sequence": [
                        {"action": "light.turn_on"},
                        {"delay": {"seconds": 30}},
                    ],
                    "end_sequence": [{"action": "light.turn_off"}],
                    "job_key": "run-for-cancelled",
                },
                attribution={"source": "service"},
            )

    start_script.async_run.assert_awaited_once()
    end_script.async_run.assert_awaited_once()
    assert not manager._create_reservations
