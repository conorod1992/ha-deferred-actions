"""Regression tests for service validation and release metadata."""

import json
from pathlib import Path

import pytest
import voluptuous as vol

from custom_components.deferred_actions.const import PANEL_JS_URL
from custom_components.deferred_actions.services import SERVICE_NAMES, SERVICE_SCHEMAS


def test_every_registered_service_has_an_explicit_schema() -> None:
    assert set(SERVICE_SCHEMAS) == set(SERVICE_NAMES)


def test_service_schemas_reject_unknown_fields_and_invalid_bulk_statuses() -> None:
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["cancel"]({"job_id": "job-1", "typo": True})
    with pytest.raises(vol.Invalid):
        SERVICE_SCHEMAS["delete_history"]({"confirm_bulk": True, "statuses": ["pending"]})


def test_run_for_schema_accepts_supported_frontend_metadata() -> None:
    data = SERVICE_SCHEMAS["run_for"](
        {
            "name": "Run heater",
            "description": "Temporary heat",
            "duration": {"minutes": 10},
            "start_sequence": [{"action": "switch.turn_on"}],
            "end_sequence": [{"action": "switch.turn_off"}],
            "job_key": "heater",
            "tags": ["office"],
            "conflict_mode": "replace_same_key",
        }
    )
    assert data["job_key"] == "heater"


def test_extend_schema_keeps_signed_duration_support() -> None:
    data = SERVICE_SCHEMAS["extend"]({"job_id": "job-1", "duration": {"minutes": -5}})
    assert data["duration"]["minutes"] == -5


def test_manifest_uses_next_release_version_and_panel_url_is_not_version_coupled() -> None:
    root = Path(__file__).parents[1]
    manifest = json.loads((root / "custom_components/deferred_actions/manifest.json").read_text())
    assert manifest["version"] == "1.7.0"
    assert PANEL_JS_URL == "/deferred_actions_frontend/deferred-actions-panel.js"
