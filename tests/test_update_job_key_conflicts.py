"""Regression tests for job_key conflicts introduced through updates."""

from unittest.mock import AsyncMock, patch

import pytest

from custom_components.deferred_actions.manager import DeferredActionsManager
from custom_components.deferred_actions.models import ConflictError


@pytest.fixture
async def manager(hass, mock_storage):
    item = DeferredActionsManager(hass, {})
    await item.async_initialize()
    yield item
    await item.async_unload()


async def create(manager, **kwargs):
    with (
        patch(
            "custom_components.deferred_actions.manager.async_validate_sequence",
            AsyncMock(side_effect=lambda _hass, value: value),
        ),
        patch(
            "custom_components.deferred_actions.manager.async_validate_conditions",
            AsyncMock(side_effect=lambda _hass, value: value or []),
        ),
    ):
        return await manager.async_create(
            name=kwargs.pop("name", "Test"),
            delay=kwargs.pop("delay", {"minutes": 20}),
            sequence=kwargs.pop("sequence", [{"action": "light.turn_off"}]),
            **kwargs,
        )


async def test_update_rejects_pending_job_key_collision(manager) -> None:
    existing = await create(manager, job_key="shared-key")
    edited = await create(manager, job_key="other-key")

    with pytest.raises(ConflictError, match="active job already uses job_key shared-key"):
        await manager.async_update(edited["id"], job_key="shared-key")

    assert manager.jobs[existing["id"]].job_key == "shared-key"
    assert manager.jobs[edited["id"]].job_key == "other-key"


async def test_update_rejects_paused_job_key_collision(manager) -> None:
    existing = await create(manager, job_key="shared-key")
    await manager.async_pause(existing["id"])
    edited = await create(manager, job_key="other-key")

    with pytest.raises(ConflictError, match="active job already uses job_key shared-key"):
        await manager.async_update(edited["id"], job_key="shared-key")

    assert manager.jobs[edited["id"]].job_key == "other-key"


async def test_update_allows_unchanged_job_key(manager) -> None:
    job = await create(manager, job_key="same-key")

    updated = await manager.async_update(job["id"], job_key="same-key", name="Updated")

    assert updated["job_key"] == "same-key"
    assert updated["name"] == "Updated"


async def test_update_allows_key_used_only_by_history(manager) -> None:
    historical = await create(manager, job_key="reusable-key")
    await manager.async_cancel(historical["id"])
    edited = await create(manager, job_key="other-key")

    updated = await manager.async_update(edited["id"], job_key="reusable-key")

    assert updated["job_key"] == "reusable-key"
