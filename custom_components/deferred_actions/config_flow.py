"""Config and options flows for Deferred Actions."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .const import (
    CONF_DEFAULT_CONFLICT_MODE,
    CONF_DEFAULT_LLM_LIMIT,
    CONF_HISTORY_ENABLED,
    CONF_HISTORY_RETENTION_DAYS,
    CONF_MAX_HISTORY_RECORDS,
    CONF_OVERDUE_GRACE_MINUTES,
    CONF_OVERDUE_POLICY,
    CONF_PANEL_ENABLED,
    CONFLICT_MODES,
    DEFAULT_OPTIONS,
    DOMAIN,
    OVERDUE_POLICIES,
)


class DeferredActionsConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Configure the single Deferred Actions instance."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None):
        """Create the singleton config entry."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            return self.async_create_entry(title="Deferred Actions", data={})
        return self.async_show_form(step_id="user", data_schema=vol.Schema({}))

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return DeferredActionsOptionsFlow()


class DeferredActionsOptionsFlow(config_entries.OptionsFlow):
    """Edit scheduler, history, LLM and panel behavior."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None):
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)
        values = {**DEFAULT_OPTIONS, **self.config_entry.options}
        schema = vol.Schema(
            {
                vol.Required(
                    CONF_OVERDUE_POLICY, default=values[CONF_OVERDUE_POLICY]
                ): selector.SelectSelector(
                    selector.SelectSelectorConfig(options=list(OVERDUE_POLICIES))
                ),
                vol.Required(
                    CONF_OVERDUE_GRACE_MINUTES, default=values[CONF_OVERDUE_GRACE_MINUTES]
                ): vol.All(int, vol.Range(min=0, max=10080)),
                vol.Required(CONF_HISTORY_ENABLED, default=values[CONF_HISTORY_ENABLED]): bool,
                vol.Required(
                    CONF_HISTORY_RETENTION_DAYS, default=values[CONF_HISTORY_RETENTION_DAYS]
                ): vol.All(int, vol.Range(min=0, max=3650)),
                vol.Required(
                    CONF_MAX_HISTORY_RECORDS, default=values[CONF_MAX_HISTORY_RECORDS]
                ): vol.All(int, vol.Range(min=0, max=10000)),
                vol.Required(
                    CONF_DEFAULT_CONFLICT_MODE, default=values[CONF_DEFAULT_CONFLICT_MODE]
                ): selector.SelectSelector(
                    selector.SelectSelectorConfig(options=list(CONFLICT_MODES))
                ),
                vol.Required(
                    CONF_DEFAULT_LLM_LIMIT, default=values[CONF_DEFAULT_LLM_LIMIT]
                ): vol.All(int, vol.Range(min=1, max=100)),
                vol.Required(CONF_PANEL_ENABLED, default=values[CONF_PANEL_ENABLED]): bool,
            }
        )
        return self.async_show_form(step_id="init", data_schema=schema)
