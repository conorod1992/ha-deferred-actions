"""Focused WebSocket lifecycle-race tests."""

from unittest.mock import MagicMock, patch

import pytest

from custom_components.deferred_actions.models import ManagerUnavailableError
from custom_components.deferred_actions.websocket import _manager


def test_manager_lookup_fails_cleanly_with_no_loaded_entry(hass) -> None:
    with (
        patch.object(hass.config_entries, "async_entries", MagicMock(return_value=[])),
        pytest.raises(ManagerUnavailableError, match="temporarily unavailable"),
    ):
        _manager(hass)
