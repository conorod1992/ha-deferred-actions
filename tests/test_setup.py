"""Focused setup ownership and periodic cleanup tests."""

from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.deferred_actions import async_setup_entry, async_unload_entry
from custom_components.deferred_actions.manager import DeferredActionsManager


async def test_periodic_cleanup_callback_awaits_manager_cleanup(hass) -> None:
    entry = MagicMock()
    entry.options = {"frontend_panel_enabled": False}
    entry.add_update_listener.return_value = MagicMock()
    manager = MagicMock()
    manager.async_initialize = AsyncMock()
    manager.async_cleanup_history = AsyncMock()
    manager.async_unload = AsyncMock()
    unsubscribe = MagicMock()

    with (
        patch("custom_components.deferred_actions.DeferredActionsManager", return_value=manager),
        patch(
            "custom_components.deferred_actions.async_track_time_interval",
            return_value=unsubscribe,
        ) as track,
        patch("custom_components.deferred_actions.async_register_services", AsyncMock()),
        patch("custom_components.deferred_actions.async_register_websocket_commands"),
        patch.object(hass.config_entries, "async_forward_entry_setups", AsyncMock()),
    ):
        assert await async_setup_entry(hass, entry)

    callback = track.call_args.args[1]
    await callback(datetime.now(UTC))
    manager.async_cleanup_history.assert_awaited_once()
    entry.async_on_unload.assert_any_call(unsubscribe)


async def test_setup_failure_cleans_initialized_resources_and_reraises(hass) -> None:
    entry = MagicMock()
    entry.options = {"frontend_panel_enabled": False}
    update_unsubscribe = MagicMock()
    entry.add_update_listener.return_value = update_unsubscribe
    manager = MagicMock()
    manager.async_initialize = AsyncMock()
    manager.async_unload = AsyncMock()
    interval_unsubscribe = MagicMock()
    unregister = AsyncMock()
    failure = RuntimeError("platform setup failed")

    with (
        patch("custom_components.deferred_actions.DeferredActionsManager", return_value=manager),
        patch(
            "custom_components.deferred_actions.async_track_time_interval",
            return_value=interval_unsubscribe,
        ),
        patch("custom_components.deferred_actions.async_register_services", AsyncMock()),
        patch("custom_components.deferred_actions.async_unregister_services", unregister),
        patch("custom_components.deferred_actions.async_register_websocket_commands"),
        patch.object(
            hass.config_entries,
            "async_forward_entry_setups",
            AsyncMock(side_effect=failure),
        ),
        patch.object(hass.config_entries, "async_unload_platforms", AsyncMock()),
        pytest.raises(RuntimeError, match="platform setup failed") as caught,
    ):
        await async_setup_entry(hass, entry)

    assert caught.value is failure
    interval_unsubscribe.assert_called_once()
    update_unsubscribe.assert_called_once()
    unregister.assert_awaited_once_with(hass)
    manager.async_unload.assert_awaited_once()

    replacement = MagicMock()
    replacement.async_initialize = AsyncMock()
    replacement.async_unload = AsyncMock()
    replacement_unsubscribe = MagicMock()
    with (
        patch(
            "custom_components.deferred_actions.DeferredActionsManager",
            return_value=replacement,
        ),
        patch(
            "custom_components.deferred_actions.async_track_time_interval",
            return_value=replacement_unsubscribe,
        ) as replacement_track,
        patch("custom_components.deferred_actions.async_register_services", AsyncMock()),
        patch("custom_components.deferred_actions.async_register_websocket_commands"),
        patch.object(hass.config_entries, "async_forward_entry_setups", AsyncMock()),
    ):
        assert await async_setup_entry(hass, entry)
    replacement.async_initialize.assert_awaited_once()
    replacement_track.assert_called_once()
    entry.async_on_unload.assert_any_call(replacement_unsubscribe)


async def test_failed_platform_unload_leaves_manager_fully_operational(hass, mock_storage) -> None:
    manager = DeferredActionsManager(hass, {})
    await manager.async_initialize()
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
        job = await manager.async_create(
            name="Still scheduled",
            sequence=[{"action": "light.turn_off"}],
            delay={"minutes": 10},
        )
    listener = MagicMock()
    manager.async_subscribe(listener)
    entry = MagicMock()
    entry.runtime_data = SimpleNamespace(manager=manager, panel_registered=True)
    unregister = AsyncMock()

    try:
        with (
            patch.object(
                hass.config_entries,
                "async_unload_platforms",
                AsyncMock(return_value=False),
            ),
            patch("custom_components.deferred_actions.async_unregister_services", unregister),
            patch("homeassistant.components.frontend.async_remove_panel") as remove_panel,
            patch.object(manager, "async_unload", wraps=manager.async_unload) as manager_unload,
        ):
            assert not await async_unload_entry(hass, entry)

        manager_unload.assert_not_awaited()
        unregister.assert_not_awaited()
        remove_panel.assert_not_called()
        assert manager.available
        assert manager.scheduler_active
        assert listener in manager._listeners

        await manager.async_cancel(job["id"])
        listener.assert_called()
    finally:
        await manager.async_unload()
