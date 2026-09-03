"""Runtime manager with failure-isolated notification delivery."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import callback
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import EVENT_PREFIX, SIGNAL_UPDATE
from .manager import DeferredActionsManager as BaseDeferredActionsManager
from .models import DeferredJob

_LOGGER = logging.getLogger(__name__)


class DeferredActionsManager(BaseDeferredActionsManager):
    """Deferred Actions manager with best-effort observer notifications."""

    @callback
    def _notify(self, event: str, job: DeferredJob | None = None, **data: Any) -> None:
        """Notify observers without allowing observer failures to alter queue state."""
        payload = {"event": event, **data}
        if job:
            payload["job"] = self._public(job)

        for listener in tuple(self._listeners):
            try:
                listener(payload)
            except Exception:
                _LOGGER.exception("Deferred Actions listener failed handling %s", event)

        try:
            async_dispatcher_send(self.hass, SIGNAL_UPDATE)
        except Exception:
            _LOGGER.exception("Deferred Actions dispatcher notification failed handling %s", event)

        if job and event.startswith("job_"):
            try:
                self.hass.bus.async_fire(
                    EVENT_PREFIX + event.removeprefix("job_"), self._event_data(job)
                )
            except Exception:
                _LOGGER.exception("Deferred Actions event-bus notification failed handling %s", event)

        summary_event = {"event": "queue_summary", "summary": self.summary()}
        for listener in tuple(self._listeners):
            try:
                listener(summary_event)
            except Exception:
                _LOGGER.exception(
                    "Deferred Actions listener failed handling queue summary after %s", event
                )
