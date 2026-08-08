"""Diagnostics for Deferred Actions."""

from __future__ import annotations

from homeassistant.core import HomeAssistant

from .const import STORAGE_VERSION, VERSION


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry) -> dict:
    manager = entry.runtime_data.manager
    summary = manager.summary()
    return {
        "integration_version": VERSION,
        "storage_version": STORAGE_VERSION,
        "counts": summary["counts"],
        "next_execution": summary["next_execution"],
        "options": dict(entry.options),
        "scheduler_callback_active": manager.scheduler_active,
        "frontend_panel_registered": entry.runtime_data.panel_registered,
        "invalid_stored_record_count": len(manager.invalid_records),
        "jobs_with_terminal_reason": sum(
            job.terminal_reason is not None for job in manager.jobs.values()
        ),
        "jobs_with_last_error": sum(job.last_error is not None for job in manager.jobs.values()),
    }
