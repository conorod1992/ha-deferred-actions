"""Home Assistant actions for Deferred Actions."""

from __future__ import annotations

from datetime import datetime
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from .const import DOMAIN, INVERSE_ACTIONS
from .models import DeferredActionsError

SERVICE_NAMES = (
    "create",
    "create_safe",
    "run_for",
    "get",
    "list",
    "update",
    "reschedule",
    "extend",
    "snooze",
    "cancel",
    "delete",
    "pause",
    "resume",
    "execute_now",
    "duplicate",
    "cancel_all",
    "delete_history",
    "cleanup_history",
)

_NONNEGATIVE_NUMBER = vol.All(vol.Coerce(float), vol.Range(min=0))
_DURATION_SCHEMA = vol.Schema(
    {
        vol.Optional("days"): _NONNEGATIVE_NUMBER,
        vol.Optional("hours"): _NONNEGATIVE_NUMBER,
        vol.Optional("minutes"): _NONNEGATIVE_NUMBER,
        vol.Optional("seconds"): _NONNEGATIVE_NUMBER,
        vol.Optional("milliseconds"): _NONNEGATIVE_NUMBER,
    },
    extra=vol.PREVENT_EXTRA,
)
_TIMESTAMP = vol.Any(str, datetime)
_NULLABLE_TIMESTAMP = vol.Any(None, str, datetime)
_OVERDUE_POLICY = vol.In(("execute", "skip", "execute_within_grace"))

_CREATE_FIELDS = {
    vol.Required("name"): str,
    vol.Required("sequence"): list,
    vol.Optional("execute_at"): _TIMESTAMP,
    vol.Optional("delay"): _DURATION_SCHEMA,
    vol.Optional("conditions"): list,
    vol.Optional("condition_failure"): vol.In(("skip", "cancel", "fail")),
    vol.Optional("overdue_policy"): _OVERDUE_POLICY,
    vol.Optional("overdue_grace"): _DURATION_SCHEMA,
    vol.Optional("valid_until"): _TIMESTAMP,
}

SERVICE_SCHEMAS = {
    "create": vol.Schema(_CREATE_FIELDS, extra=vol.ALLOW_EXTRA),
    "create_safe": vol.Schema(
        {
            vol.Required("name"): str,
            vol.Exclusive("action", "safe_action"): str,
            vol.Exclusive("service", "safe_action"): str,
            vol.Required("target_entities"): vol.Any(str, [str]),
            vol.Optional("data"): dict,
            vol.Optional("execute_at"): _TIMESTAMP,
            vol.Optional("delay"): _DURATION_SCHEMA,
            vol.Optional("description"): str,
            vol.Optional("job_key"): str,
            vol.Optional("tags"): [str],
            vol.Optional("conflict_mode"): str,
            vol.Optional("conditions"): list,
            vol.Optional("condition_failure"): vol.In(("skip", "cancel", "fail")),
            vol.Optional("overdue_policy"): _OVERDUE_POLICY,
            vol.Optional("overdue_grace"): _DURATION_SCHEMA,
            vol.Optional("valid_until"): _TIMESTAMP,
        },
        extra=vol.PREVENT_EXTRA,
    ),
    "update": vol.Schema(
        {
            vol.Required("job_id"): str,
            vol.Optional("expected_revision"): vol.All(vol.Coerce(int), vol.Range(min=1)),
            vol.Optional("conditions"): vol.Any(None, list),
            vol.Optional("condition_failure"): vol.In(("skip", "cancel", "fail")),
            vol.Optional("overdue_policy"): vol.Any(None, _OVERDUE_POLICY),
            vol.Optional("overdue_grace"): vol.Any(None, _DURATION_SCHEMA),
            vol.Optional("valid_until"): _NULLABLE_TIMESTAMP,
            vol.Optional("target_entities"): list,
        },
        extra=vol.ALLOW_EXTRA,
    ),
    "reschedule": vol.Schema(
        {
            vol.Required("job_id"): str,
            vol.Optional("execute_at"): _TIMESTAMP,
            vol.Optional("delay"): _DURATION_SCHEMA,
        },
        extra=vol.PREVENT_EXTRA,
    ),
    "duplicate": vol.Schema(
        {
            vol.Required("job_id"): str,
            vol.Optional("name"): str,
            vol.Optional("execute_at"): _TIMESTAMP,
            vol.Optional("delay"): _DURATION_SCHEMA,
        },
        extra=vol.PREVENT_EXTRA,
    ),
    "snooze": vol.Schema(
        {vol.Required("job_id"): str, vol.Required("duration"): _DURATION_SCHEMA},
        extra=vol.PREVENT_EXTRA,
    ),
}


def _manager(hass: HomeAssistant):
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries or not hasattr(entries[0], "runtime_data"):
        raise HomeAssistantError("Deferred Actions is not configured")
    return entries[0].runtime_data.manager


def _attribution(call: ServiceCall, source: str) -> dict[str, Any]:
    return {
        "source": source,
        "created_by_user_id": call.context.user_id,
        "created_by_context_id": call.context.id,
        "parent_context_id": call.context.parent_id,
    }


async def async_run_for(
    manager,
    data: dict[str, Any],
    *,
    attribution: dict[str, Any],
    context=None,
) -> dict[str, Any]:
    """Execute a start sequence, then schedule its end sequence."""
    from homeassistant.helpers.script import Script

    from .executor import async_validate_sequence

    duration = data.get("duration")
    if not duration:
        raise ServiceValidationError("duration is required")
    entities = data.get("entity_id") or data.get("target", {}).get("entity_id") or []
    if isinstance(entities, str):
        entities = [entities]
    start_sequence = data.get("start_sequence")
    end_sequence = data.get("end_sequence")
    start_action = data.get("start_action")
    end_action = data.get("end_action")
    if not start_sequence:
        if not start_action or not entities:
            raise ServiceValidationError(
                "Provide start_sequence or an entity target and start_action"
            )
        start_sequence = [{"action": start_action, "target": {"entity_id": entities}}]
    if not end_sequence:
        end_action = end_action or INVERSE_ACTIONS.get(start_action)
        if not end_action:
            raise ServiceValidationError("An explicit end action or end sequence is required")
        end_sequence = [{"action": end_action, "target": {"entity_id": entities}}]
    start_sequence = await async_validate_sequence(manager.hass, start_sequence)
    end_sequence = await async_validate_sequence(manager.hass, end_sequence)
    script = Script(manager.hass, start_sequence, "Deferred Actions run-for start", DOMAIN)
    await script.async_run(context=context)
    return await manager.async_create(
        name=data.get("name", "Run for timer"),
        description=data.get("description"),
        delay=duration,
        sequence=end_sequence,
        job_key=data.get("job_key"),
        tags=data.get("tags"),
        source=attribution.get("source", "service"),
        target_entities=entities,
        conflict_mode=data.get("conflict_mode"),
        attribution=attribution,
        linkage={"operation": "run_for", "start_action": start_action, "end_action": end_action},
    )


async def _async_handle_service(hass: HomeAssistant, call: ServiceCall):
    manager = _manager(hass)
    data = dict(call.data)
    operation = call.service
    try:
        if operation == "create":
            source = data.pop("source", "service")
            return {
                "job": await manager.async_create(
                    **data,
                    source=source,
                    attribution=_attribution(call, "service"),
                )
            }
        if operation == "create_safe":
            return {
                "job": await manager.async_create_safe(
                    **data,
                    attribution=_attribution(call, "safe_service"),
                )
            }
        if operation == "run_for":
            return {
                "job": await async_run_for(
                    manager,
                    data,
                    attribution=_attribution(call, "service"),
                    context=call.context,
                )
            }
        if operation == "get":
            return {"job": manager.async_get(**data)}
        if operation == "list":
            return manager.async_list(**data)
        if operation == "update":
            job_id = data.pop("job_id")
            return {"job": await manager.async_update(job_id, **data)}
        if operation == "reschedule":
            job_id = data.pop("job_id")
            return {"job": await manager.async_reschedule(job_id, **data)}
        if operation == "extend":
            return {"job": await manager.async_extend(data["job_id"], data["duration"])}
        if operation == "snooze":
            return {"job": await manager.async_snooze(data["job_id"], data["duration"])}
        if operation in {"cancel", "delete", "pause", "execute_now"}:
            return {"job": await getattr(manager, f"async_{operation}")(data["job_id"])}
        if operation == "resume":
            job_id = data.pop("job_id")
            return {"job": await manager.async_resume(job_id, **data)}
        if operation == "duplicate":
            job_id = data.pop("job_id")
            return {"job": await manager.async_duplicate(job_id, **data)}
        if operation == "cancel_all":
            return await manager.async_cancel_all(**data)
        if operation == "delete_history":
            return await manager.async_delete_history(**data)
        if operation == "cleanup_history":
            return await manager.async_cleanup_history()
    except DeferredActionsError as err:
        raise ServiceValidationError(
            str(err), translation_domain=DOMAIN, translation_key=err.code
        ) from err
    except (KeyError, TypeError, ValueError) as err:
        raise ServiceValidationError(str(err)) from err
    raise ServiceValidationError(f"Unknown Deferred Actions operation: {operation}")


async def async_register_services(hass: HomeAssistant) -> None:
    """Register actions once for the singleton integration."""
    for name in SERVICE_NAMES:
        if not hass.services.has_service(DOMAIN, name):
            hass.services.async_register(
                DOMAIN,
                name,
                lambda call, _hass=hass: _async_handle_service(_hass, call),
                schema=SERVICE_SCHEMAS.get(name, vol.Schema({}, extra=vol.ALLOW_EXTRA)),
                supports_response=SupportsResponse.ONLY,
            )


async def async_unregister_services(hass: HomeAssistant) -> None:
    for name in SERVICE_NAMES:
        hass.services.async_remove(DOMAIN, name)
