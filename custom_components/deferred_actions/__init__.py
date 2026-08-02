"""Deferred Actions integration setup."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.event import async_track_time_interval

from .const import (
    CONF_PANEL_ENABLED,
    DEFAULT_OPTIONS,
    DOMAIN,
    HISTORY_CLEANUP_INTERVAL,
    PANEL_COMPONENT,
    PANEL_JS_URL,
    PANEL_URL,
    PLATFORMS,
)
from .manager import DeferredActionsManager
from .services import async_register_services, async_unregister_services
from .websocket import async_register_websocket_commands

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


@dataclass(slots=True)
class DeferredActionsRuntimeData:
    manager: DeferredActionsManager
    panel_registered: bool = False


DeferredActionsConfigEntry = ConfigEntry[DeferredActionsRuntimeData]


async def async_setup_entry(hass: HomeAssistant, entry: DeferredActionsConfigEntry) -> bool:
    """Set up Deferred Actions from a config entry."""
    manager = DeferredActionsManager(hass, dict(entry.options))
    await manager.async_initialize()
    runtime = DeferredActionsRuntimeData(manager=manager)
    entry.runtime_data = runtime

    await async_register_services(hass)
    async_register_websocket_commands(hass)
    entry.async_on_unload(
        async_track_time_interval(
            hass, lambda _now: manager.async_cleanup_history(), HISTORY_CLEANUP_INTERVAL
        )
    )
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))

    options = {**DEFAULT_OPTIONS, **entry.options}
    if options[CONF_PANEL_ENABLED]:
        static_marker = "_deferred_actions_static_registered"
        if not hass.data.get(static_marker):
            frontend_dir = Path(__file__).parent / "frontend"
            await hass.http.async_register_static_paths(
                [StaticPathConfig("/deferred_actions_frontend", str(frontend_dir), True)]
            )
            hass.data[static_marker] = True
        frontend.async_register_built_in_panel(
            hass,
            component_name="custom",
            sidebar_title="Deferred Actions",
            sidebar_icon="mdi:calendar-clock",
            frontend_url_path=PANEL_URL,
            config={
                "_panel_custom": {
                    "name": PANEL_COMPONENT,
                    "module_url": PANEL_JS_URL,
                    "embed_iframe": False,
                    "trust_external": False,
                }
            },
            require_admin=True,
        )
        runtime.panel_registered = True

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _async_options_updated(hass: HomeAssistant, entry: DeferredActionsConfigEntry) -> None:
    """Apply behavior options immediately; reload only when panel visibility changes."""
    entry.runtime_data.manager.update_options(dict(entry.options))
    await entry.runtime_data.manager.async_cleanup_history()
    desired = {**DEFAULT_OPTIONS, **entry.options}[CONF_PANEL_ENABLED]
    if desired != entry.runtime_data.panel_registered:
        await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: DeferredActionsConfigEntry) -> bool:
    """Unload the entry and all owned resources."""
    if not await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        return False
    await entry.runtime_data.manager.async_unload()
    if entry.runtime_data.panel_registered:
        frontend.async_remove_panel(hass, PANEL_URL)
    await async_unregister_services(hass)
    return True


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Allow discovery of the config-flow-only integration."""
    return True
