"""Summary sensor for Deferred Actions."""

from __future__ import annotations

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN, SIGNAL_UPDATE


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    async_add_entities([DeferredActionsSensor(entry)])


class DeferredActionsSensor(SensorEntity):
    """A push-updated queue summary, without the full job list."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_icon = "mdi:calendar-clock"
    _attr_should_poll = False

    def __init__(self, entry: ConfigEntry) -> None:
        self._entry = entry
        self._attr_unique_id = DOMAIN
        self._attr_device_info = {
            "identifiers": {(DOMAIN, DOMAIN)},
            "name": "Deferred Actions",
            "manufacturer": "Deferred Actions",
            "model": "Persistent scheduler",
        }

    @property
    def native_value(self) -> int:
        return self._entry.runtime_data.manager.summary()["pending"]

    @property
    def extra_state_attributes(self):
        summary = self._entry.runtime_data.manager.summary()
        return {key: value for key, value in summary.items() if key != "counts"}

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_UPDATE, self._async_updated)
        )

    @callback
    def _async_updated(self) -> None:
        self.async_write_ha_state()
