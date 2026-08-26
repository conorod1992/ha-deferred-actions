"""Storage adapter for Deferred Actions."""

from __future__ import annotations

import logging
from copy import deepcopy
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_MINOR_VERSION, STORAGE_VERSION
from .models import DeferredActionsError, DeferredJob

_LOGGER = logging.getLogger(__name__)


class _DeferredActionsStore(Store[dict[str, Any]]):
    """Store with an explicit forward migration hook."""

    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: dict[str, Any]
    ) -> dict[str, Any]:
        if old_major_version == 1 and old_minor_version <= STORAGE_MINOR_VERSION:
            old_data.setdefault("schema_version", 1)
            old_data.setdefault("jobs", [])
            return old_data
        raise NotImplementedError


class DeferredActionsStorage:
    """Versioned Home Assistant storage wrapper."""

    def __init__(self, hass: HomeAssistant) -> None:
        self._store: Store[dict[str, Any]] = _DeferredActionsStore(
            hass,
            STORAGE_VERSION,
            STORAGE_KEY,
            minor_version=STORAGE_MINOR_VERSION,
            atomic_writes=True,
        )
        self._quarantined_records: list[Any] = []

    async def async_load(self) -> tuple[dict[str, DeferredJob], list[dict[str, Any]]]:
        """Load valid jobs and return quarantined invalid records."""
        raw = await self._store.async_load() or {"schema_version": 1, "jobs": []}
        jobs: dict[str, DeferredJob] = {}
        invalid: list[dict[str, Any]] = []
        records = raw.get("jobs", []) if isinstance(raw, dict) else []
        if not isinstance(records, list):
            records = [records]
        self._quarantined_records = []
        for record in records:
            try:
                job = DeferredJob.from_storage(record)
                jobs[job.id] = job
            except (DeferredActionsError, KeyError, TypeError, ValueError) as err:
                _LOGGER.warning("Ignoring invalid stored deferred action: %s", err)
                self._quarantined_records.append(deepcopy(record))
                raw_record_id = record.get("id") if isinstance(record, dict) else None
                record_id = (
                    str(raw_record_id)[:100] if isinstance(raw_record_id, (int, str)) else None
                )
                invalid.append({"error": str(err)[:200], "record_id": record_id})
        return jobs, invalid

    def _data(self, jobs: dict[str, DeferredJob]) -> dict[str, Any]:
        """Build a snapshot without dropping quarantined raw records."""
        return {
            "schema_version": STORAGE_VERSION,
            "jobs": [
                *(j.to_storage() for j in jobs.values()),
                *deepcopy(self._quarantined_records),
            ],
        }

    async def async_save(self, jobs: dict[str, DeferredJob]) -> None:
        """Persist the full collection immediately."""
        await self._store.async_save(self._data(jobs))

    async def async_delay_save(self, jobs: dict[str, DeferredJob]) -> None:
        """Coalesce routine saves while retaining an immediate flush option."""
        snapshot = self._data(jobs)
        self._store.async_delay_save(lambda: snapshot, 1)
