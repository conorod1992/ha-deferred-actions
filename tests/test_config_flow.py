"""Config and options flow tests."""

from homeassistant import config_entries
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.deferred_actions.const import DOMAIN


async def test_config_flow(hass) -> None:
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is config_entries.FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {})
    assert result["type"] is config_entries.FlowResultType.CREATE_ENTRY


async def test_single_instance(hass) -> None:
    MockConfigEntry(domain=DOMAIN, unique_id=DOMAIN).add_to_hass(hass)
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is config_entries.FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_options_flow(hass) -> None:
    entry = MockConfigEntry(domain=DOMAIN, unique_id=DOMAIN)
    entry.add_to_hass(hass)
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"],
        {
            "overdue_policy": "skip",
            "overdue_grace_minutes": 20,
            "history_enabled": True,
            "history_retention_days": 14,
            "maximum_history_records": 200,
            "default_conflict_mode": "keep_all",
            "default_maximum_llm_list_results": 5,
            "frontend_panel_enabled": False,
        },
    )
    assert result["type"] is config_entries.FlowResultType.CREATE_ENTRY
    assert entry.options["overdue_policy"] == "skip"
