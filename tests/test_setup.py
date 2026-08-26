"""Focused setup ownership and periodic cleanup tests."""

from datetime import UTC, datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from custom_components.deferred_actions import async_setup_entry


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
