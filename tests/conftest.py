"""Deferred Actions test fixtures."""

from __future__ import annotations

from collections.abc import Generator
from unittest.mock import AsyncMock, patch

import pytest

pytest_plugins = "pytest_homeassistant_custom_component"


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations) -> Generator[None]:
    yield


@pytest.fixture
def mock_storage():
    with (
        patch(
            "custom_components.deferred_actions.storage.DeferredActionsStorage.async_load",
            AsyncMock(return_value=({}, [])),
        ),
        patch(
            "custom_components.deferred_actions.storage.DeferredActionsStorage.async_save",
            AsyncMock(),
        ),
        patch(
            "custom_components.deferred_actions.storage.DeferredActionsStorage.async_delay_save",
            AsyncMock(),
        ),
    ):
        yield
