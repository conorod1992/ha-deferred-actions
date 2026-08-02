"""Constants for Deferred Actions."""

from __future__ import annotations

from datetime import timedelta
from typing import Final

DOMAIN: Final = "deferred_actions"
NAME: Final = "Deferred Actions"
VERSION: Final = "0.1.0"
PLATFORMS: Final = ["sensor"]

STORAGE_KEY: Final = f"{DOMAIN}.jobs"
STORAGE_VERSION: Final = 1
STORAGE_MINOR_VERSION: Final = 1

CONF_OVERDUE_POLICY: Final = "overdue_policy"
CONF_OVERDUE_GRACE_MINUTES: Final = "overdue_grace_minutes"
CONF_HISTORY_ENABLED: Final = "history_enabled"
CONF_HISTORY_RETENTION_DAYS: Final = "history_retention_days"
CONF_MAX_HISTORY_RECORDS: Final = "maximum_history_records"
CONF_DEFAULT_CONFLICT_MODE: Final = "default_conflict_mode"
CONF_DEFAULT_LLM_LIMIT: Final = "default_maximum_llm_list_results"
CONF_PANEL_ENABLED: Final = "frontend_panel_enabled"

OVERDUE_EXECUTE: Final = "execute"
OVERDUE_SKIP: Final = "skip"
OVERDUE_GRACE: Final = "execute_within_grace"
OVERDUE_POLICIES: Final = (OVERDUE_EXECUTE, OVERDUE_SKIP, OVERDUE_GRACE)

CONFLICT_KEEP_ALL: Final = "keep_all"
CONFLICT_REPLACE: Final = "replace_same_key"
CONFLICT_CANCEL: Final = "cancel_same_key"
CONFLICT_REJECT: Final = "reject_same_key"
CONFLICT_MODES: Final = (
    CONFLICT_KEEP_ALL,
    CONFLICT_REPLACE,
    CONFLICT_CANCEL,
    CONFLICT_REJECT,
)

DEFAULT_OPTIONS: Final = {
    CONF_OVERDUE_POLICY: OVERDUE_GRACE,
    CONF_OVERDUE_GRACE_MINUTES: 15,
    CONF_HISTORY_ENABLED: True,
    CONF_HISTORY_RETENTION_DAYS: 7,
    CONF_MAX_HISTORY_RECORDS: 500,
    CONF_DEFAULT_CONFLICT_MODE: CONFLICT_KEEP_ALL,
    CONF_DEFAULT_LLM_LIMIT: 10,
    CONF_PANEL_ENABLED: True,
}

ACTIVE_STATUSES: Final = {"pending", "paused", "executing"}
HISTORY_STATUSES: Final = {"completed", "cancelled", "failed", "missed"}
ALL_STATUSES: Final = ACTIVE_STATUSES | HISTORY_STATUSES
MUTABLE_STATUSES: Final = {"pending", "paused"}
EXECUTABLE_STATUSES: Final = {"pending", "paused", "failed", "missed"}

SIGNAL_UPDATE: Final = f"{DOMAIN}_updated"
PANEL_URL: Final = "deferred-actions"
PANEL_COMPONENT: Final = "deferred-actions-panel"
PANEL_JS_URL: Final = "/deferred_actions_frontend/deferred-actions-panel.js"

EVENT_PREFIX: Final = f"{DOMAIN}_job_"
HISTORY_CLEANUP_INTERVAL: Final = timedelta(hours=6)

INVERSE_ACTIONS: Final = {
    "light.turn_on": "light.turn_off",
    "switch.turn_on": "switch.turn_off",
    "fan.turn_on": "fan.turn_off",
    "input_boolean.turn_on": "input_boolean.turn_off",
    "media_player.media_play": "media_player.media_pause",
}
