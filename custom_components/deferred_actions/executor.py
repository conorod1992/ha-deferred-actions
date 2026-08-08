"""Action sequence validation and execution."""

from __future__ import annotations

import logging
from copy import deepcopy
from typing import Any

from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers import condition
from homeassistant.helpers.script import Script, async_validate_actions_config
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .models import DeferredJob, InvalidActionError, InvalidConditionError

_LOGGER = logging.getLogger(__name__)


async def async_validate_sequence(
    hass: HomeAssistant, sequence: list[dict[str, object]]
) -> list[ConfigType]:
    """Validate a complete Home Assistant action sequence."""
    if not isinstance(sequence, list) or not sequence:
        raise InvalidActionError("sequence must contain at least one action")
    try:
        await async_validate_actions_config(hass, deepcopy(sequence))
    except Exception as err:
        raise InvalidActionError(f"Invalid action sequence: {err}") from err
    # Validation produces Template and other runtime objects. Persist the original,
    # JSON-safe configuration and validate it again immediately before execution.
    return deepcopy(sequence)


async def async_validate_conditions(
    hass: HomeAssistant, conditions: list[dict[str, Any]] | None
) -> list[dict[str, Any]]:
    """Validate normal Home Assistant conditions while persisting JSON-safe input."""
    if conditions is None:
        return []
    if not isinstance(conditions, list):
        raise InvalidConditionError("conditions must be a list")
    try:
        await condition.async_validate_conditions_config(hass, deepcopy(conditions))
    except Exception as err:
        raise InvalidConditionError(f"Invalid execution conditions: {err}") from err
    return deepcopy(conditions)


async def async_conditions_pass(hass: HomeAssistant, job: DeferredJob) -> bool:
    """Revalidate and evaluate a job's conditions immediately before execution."""
    if not job.conditions:
        return True
    validated = await condition.async_validate_conditions_config(hass, deepcopy(job.conditions))
    checker = await condition.async_conditions_from_config(
        hass, validated, _LOGGER, f"Deferred action conditions: {job.name}"
    )
    variables = {
        "deferred_action": {
            "id": job.id,
            "name": job.name,
            "scheduled_for": job.execute_at.isoformat(),
            "created_at": job.created_at.isoformat(),
            "job_key": job.job_key,
            "tags": job.tags,
        }
    }
    return checker(variables)


async def async_execute_job(hass: HomeAssistant, job: DeferredJob) -> None:
    """Execute a job through Home Assistant's script engine."""
    sequence = await async_validate_actions_config(hass, deepcopy(job.sequence))
    script = Script(
        hass,
        sequence,
        f"Deferred action: {job.name}",
        DOMAIN,
        script_mode="parallel",
        max_runs=1,
    )
    context = Context(
        user_id=job.attribution.get("created_by_user_id"),
        parent_id=job.attribution.get("created_by_context_id"),
    )
    await script.async_run(
        {
            "deferred_action": {
                "id": job.id,
                "name": job.name,
                "scheduled_for": job.execute_at.isoformat(),
                "created_at": job.created_at.isoformat(),
                "job_key": job.job_key,
                "tags": job.tags,
            }
        },
        context=context,
    )
