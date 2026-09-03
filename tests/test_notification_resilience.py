"""Regression tests for observer failures after durable queue mutations."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.deferred_actions.runtime_manager import DeferredActionsManager
from custom_components.deferred_actions.services import async_run_for


@pytest.fixture
async def manager(hass, mock_storage):
    item = DeferredActionsManager(hass, {})
    await item.async_initialize()
    yield item
    await item.async_unload()


async def test_run_for_listener_failure_does_not_trigger_compensation(manager) -> None:
    """A post-save observer error must not look like a failed durable commit."""
    validators = AsyncMock(side_effect=lambda _hass, value: value)
    start_script = MagicMock()
    start_script.async_run = AsyncMock()
    end_script = MagicMock()
    end_script.async_run = AsyncMock()
    script_factory = MagicMock(side_effect=[start_script, end_script])

    def broken_listener(_payload):
        raise RuntimeError("listener failed")

    manager.async_subscribe(broken_listener)

    with (
        patch("homeassistant.helpers.script.Script", script_factory),
        patch("custom_components.deferred_actions.executor.async_validate_sequence", validators),
        patch("custom_components.deferred_actions.manager.async_validate_sequence", validators),
    ):
        result = await async_run_for(
            manager,
            {
                "duration": {"minutes": 5},
                "start_sequence": [{"action": "light.turn_on"}],
                "end_sequence": [{"action": "light.turn_off"}],
                "job_key": "notification-failure",
            },
            attribution={"source": "service"},
        )

    start_script.async_run.assert_awaited_once()
    end_script.async_run.assert_not_awaited()
    assert result["id"] in manager.jobs
    assert manager.jobs[result["id"]].job_key == "notification-failure"
    assert not manager._create_reservations
