"""Native LLM tools contributed to compatible Home Assistant APIs."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components.llm import LLMTools
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.llm import LLMContext, Tool, ToolInput
from homeassistant.util.json import JsonObjectType

from .const import CONF_DEFAULT_LLM_LIMIT, DEFAULT_OPTIONS, DOMAIN
from .models import AmbiguousJobError, DeferredActionsError
from .services import async_run_for

PROMPT = """Deferred Actions schedules one-off Home Assistant action sequences. Use
run_for for 'turn on X for 20 minutes' and create for 'turn off X in 20 minutes'.
List or get before editing when the job is unclear, and never guess among matches.
Confirm the resulting local date and time when useful. Do not use these tools for
ordinary immediate control except run_for's immediate start. The calling assistant
remains responsible for deciding which Home Assistant actions it may perform."""

COMMON_SCHEMA = vol.Schema(
    {
        vol.Optional("job_id"): str,
        vol.Optional("job_key"): str,
        vol.Optional("name"): str,
        vol.Optional("description"): str,
        vol.Optional("execute_at"): str,
        vol.Optional("delay"): dict,
        vol.Optional("duration"): dict,
        vol.Optional("sequence"): list,
        vol.Optional("start_sequence"): list,
        vol.Optional("end_sequence"): list,
        vol.Optional("start_action"): str,
        vol.Optional("end_action"): str,
        vol.Optional("entity_id"): vol.Any(str, [str]),
        vol.Optional("tags"): [str],
        vol.Optional("statuses"): [str],
        vol.Optional("name_query"): str,
        vol.Optional("target_entity"): str,
        vol.Optional("most_recent_pending"): bool,
        vol.Optional("expected_revision"): int,
        vol.Optional("pending_only"): bool,
        vol.Optional("include_history"): bool,
        vol.Optional("limit"): int,
    },
    extra=vol.ALLOW_EXTRA,
)

DESCRIPTIONS = {
    "create": "Create a one-off deferred action from an absolute time or relative delay and a complete action sequence.",
    "run_for": "Run a device action or sequence immediately and schedule an end sequence after a duration.",
    "list": "List deferred actions compactly; use filters to identify the intended job.",
    "get": "Get one deferred action by ID, exact key, name, target entity, or most recent pending job. Never guess among candidates.",
    "update": "Edit mutable fields of a pending or paused deferred action; expected_revision prevents stale edits.",
    "reschedule": "Set a new absolute time or relative delay for a deferred action.",
    "extend": "Move a deferred action by a positive or negative duration.",
    "cancel": "Stop a pending or paused action while retaining its record in history.",
    "delete": "Permanently remove one record; only use when the user explicitly asks to delete it.",
    "pause": "Pause a pending deferred action without changing its scheduled time.",
    "resume": "Resume a paused action, optionally with a replacement time or delay.",
    "execute_now": "Immediately run a pending, paused, failed, or missed deferred action.",
    "duplicate": "Copy a deferred action to a new ID and supplied execution time or delay.",
}


def _manager(hass: HomeAssistant):
    return hass.config_entries.async_entries(DOMAIN)[0].runtime_data.manager


class DeferredActionTool(Tool):
    """Focused operation tool backed by the central manager."""

    parameters = COMMON_SCHEMA

    def __init__(self, operation: str) -> None:
        self.operation = operation
        self.name = f"deferred_actions_{operation}"
        self.description = DESCRIPTIONS[operation]

    async def async_call(
        self, hass: HomeAssistant, tool_input: ToolInput, llm_context: LLMContext
    ) -> JsonObjectType:
        manager = _manager(hass)
        data = dict(tool_input.tool_args)
        attribution = {
            "created_by_user_id": llm_context.context.user_id,
            "created_by_context_id": llm_context.context.id,
            "parent_context_id": llm_context.context.parent_id,
            "llm_platform": llm_context.platform,
            "device_id": llm_context.device_id,
        }
        try:
            if self.operation == "create":
                job = await manager.async_create(**data, source="llm", attribution=attribution)
                return _spoken_job(job, "Scheduled")
            if self.operation == "run_for":
                job = await async_run_for(
                    manager,
                    data,
                    attribution={**attribution, "source": "llm"},
                    context=llm_context.context,
                )
                return _spoken_job(job, "Started and scheduled the end action")
            if self.operation == "list":
                data.setdefault(
                    "limit",
                    manager.options.get(
                        CONF_DEFAULT_LLM_LIMIT, DEFAULT_OPTIONS[CONF_DEFAULT_LLM_LIMIT]
                    ),
                )
                result = manager.async_list(**data)
                result["jobs"] = [_compact(job) for job in result["jobs"]]
                return result
            if self.operation == "get":
                return {"job": manager.async_get(**data)}
            if self.operation in {"update", "reschedule", "resume", "duplicate"}:
                job_id = data.pop("job_id")
                job = await getattr(manager, f"async_{self.operation}")(job_id, **data)
            elif self.operation == "extend":
                job = await manager.async_extend(data["job_id"], data["duration"])
            else:
                job = await getattr(manager, f"async_{self.operation}")(data["job_id"])
            return _spoken_job(job, self.operation.replace("_", " ").title())
        except AmbiguousJobError as err:
            return {
                "success": False,
                "error": str(err),
                "candidates": err.candidates,
                "needs_clarification": True,
            }
        except (DeferredActionsError, KeyError, TypeError, ValueError) as err:
            return {"success": False, "error": str(err)}


def _compact(job: dict[str, Any]) -> dict[str, Any]:
    return {
        key: job.get(key)
        for key in (
            "id",
            "name",
            "status",
            "execute_at_local",
            "seconds_remaining",
            "action_summary",
        )
    }


def _spoken_job(job: dict[str, Any], verb: str) -> dict[str, Any]:
    return {
        "success": True,
        "job": job,
        "confirmation": f"{verb} {job['name']} for {job['execute_at_local']}",
    }


@callback
def async_get_tools(hass: HomeAssistant, llm_context: LLMContext, api_id: str) -> LLMTools | None:
    """Contribute tools when Deferred Actions is configured."""
    if not hass.config_entries.async_loaded_entries(DOMAIN):
        return None
    return LLMTools(
        tools=[DeferredActionTool(operation) for operation in DESCRIPTIONS],
        prompt=PROMPT,
    )
