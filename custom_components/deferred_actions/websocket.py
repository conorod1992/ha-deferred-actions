"""Authenticated WebSocket API for the Deferred Actions panel."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .models import AmbiguousJobError, DeferredActionsError

COMMANDS = (
    "list",
    "get",
    "create",
    "update",
    "reschedule",
    "extend",
    "cancel",
    "delete",
    "pause",
    "resume",
    "execute_now",
    "duplicate",
)


def _manager(hass: HomeAssistant):
    return hass.config_entries.async_entries(DOMAIN)[0].runtime_data.manager


async def _dispatch(manager, operation: str, data: dict[str, Any]):
    if operation == "list":
        return manager.async_list(**data)
    if operation == "get":
        return {"job": manager.async_get(**data)}
    if operation == "create":
        return {"job": await manager.async_create(**data, source="frontend")}
    if operation in {"update", "reschedule", "resume", "duplicate"}:
        job_id = data.pop("job_id")
        return {"job": await getattr(manager, f"async_{operation}")(job_id, **data)}
    if operation == "extend":
        return {"job": await manager.async_extend(data["job_id"], data["duration"])}
    return {"job": await getattr(manager, f"async_{operation}")(data["job_id"])}


def _make_handler(operation: str):
    @websocket_api.websocket_command(
        {vol.Required("type"): f"{DOMAIN}/{operation}", vol.Optional("data", default={}): dict}
    )
    @websocket_api.require_admin
    @websocket_api.async_response
    async def handler(hass: HomeAssistant, connection, msg):
        try:
            result = await _dispatch(_manager(hass), operation, dict(msg["data"]))
        except AmbiguousJobError as err:
            connection.send_result(
                msg["id"],
                {
                    "success": False,
                    "error": {"code": err.code, "message": str(err)},
                    "candidates": err.candidates,
                },
            )
        except DeferredActionsError as err:
            connection.send_error(msg["id"], err.code, str(err))
        except (KeyError, TypeError, ValueError) as err:
            connection.send_error(msg["id"], "invalid_request", str(err))
        else:
            connection.send_result(msg["id"], result)

    handler.__name__ = f"websocket_{operation}"
    return handler


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe"})
@websocket_api.require_admin
@callback
def websocket_subscribe(hass: HomeAssistant, connection, msg):
    """Subscribe an authenticated administrator to queue changes."""
    manager = _manager(hass)
    connection.send_result(msg["id"])
    connection.subscriptions[msg["id"]] = manager.async_subscribe(
        lambda event: connection.send_message(websocket_api.event_message(msg["id"], event))
    )


def async_register_websocket_commands(hass: HomeAssistant) -> None:
    """Register all commands once."""
    marker = f"_{DOMAIN}_websocket_registered"
    if hass.data.get(marker):
        return
    for operation in COMMANDS:
        websocket_api.async_register_command(hass, _make_handler(operation))
    websocket_api.async_register_command(hass, websocket_subscribe)
    hass.data[marker] = True
