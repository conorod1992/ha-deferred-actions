"""Action sequence validation and execution."""

from __future__ import annotations

from copy import deepcopy

from homeassistant.core import Context, HomeAssistant
from homeassistant.helpers.script import Script, async_validate_actions_config
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .models import DeferredJob, InvalidActionError


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
