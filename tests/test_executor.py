"""Execution-time condition validation and evaluation tests."""

from custom_components.deferred_actions.executor import (
    async_conditions_pass,
    async_validate_conditions,
)
from custom_components.deferred_actions.models import DeferredJob, utc_now


async def test_home_assistant_conditions_are_revalidated_and_evaluated(hass) -> None:
    now = utc_now()
    conditions = [
        {
            "condition": "state",
            "entity_id": "switch.office_heater",
            "state": "on",
        }
    ]
    assert await async_validate_conditions(hass, conditions) == conditions
    job = DeferredJob(
        id="condition-job",
        name="Condition job",
        execute_at=now,
        sequence=[{"action": "switch.turn_off"}],
        created_at=now,
        modified_at=now,
        conditions=conditions,
    )
    hass.states.async_set("switch.office_heater", "on")
    assert await async_conditions_pass(hass, job) is True
    hass.states.async_set("switch.office_heater", "off")
    assert await async_conditions_pass(hass, job) is False
