"""Native LLM contribution tests."""

from custom_components.deferred_actions.llm import DESCRIPTIONS, PROMPT, DeferredActionTool


def test_all_focused_tools_have_schemas_and_descriptions() -> None:
    expected = {
        "create",
        "run_for",
        "list",
        "get",
        "update",
        "reschedule",
        "extend",
        "cancel",
        "delete",
        "pause",
        "resume",
        "execute_now",
        "duplicate",
    }
    assert set(DESCRIPTIONS) == expected
    for operation in expected:
        tool = DeferredActionTool(operation)
        assert tool.name == f"deferred_actions_{operation}"
        assert tool.description
        assert tool.parameters


def test_prompt_has_safety_guidance() -> None:
    assert "never guess" in PROMPT
    assert "calling assistant" in PROMPT
