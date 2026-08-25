import { describe, expect, it } from "vitest";
import { conditionsToVisual, friendlyError, parsePrimitive, sequenceToVisual, visualToConditions, visualToSequence } from "./editor-model";

describe("visual action conversion", () => {
  it("round trips a multi-action sequence with HA targets and scalar data", () => {
    const sequence = [
      { action: "light.turn_on", target: { entity_id: ["light.office"], area_id: ["office"] }, data: { brightness_pct: 60 } },
      { action: "notify.mobile_app_phone", data: { message: "Heating started", enabled: true } },
    ];
    const visual = sequenceToVisual(sequence);
    expect(visual).toBeDefined();
    expect(visualToSequence(visual!)).toEqual(sequence);
  });

  it("preserves the legacy service key while editing visually", () => {
    const visual = sequenceToVisual([{ service: "switch.turn_off", target: { entity_id: "switch.office" } }]);
    expect(visualToSequence(visual!)).toEqual([{ service: "switch.turn_off", target: { entity_id: "switch.office" } }]);
  });

  it("rejects advanced actions and nested data without changing them", () => {
    expect(sequenceToVisual([{ choose: [], default: [] }])).toBeUndefined();
    expect(sequenceToVisual([{ action: "light.turn_on", data: { transition: { seconds: 2 } } }])).toBeUndefined();
  });
});

describe("visual condition conversion", () => {
  it("round trips supported AND conditions", () => {
    const source = [
      { condition: "state", entity_id: "binary_sensor.home", state: "on" },
      { condition: "numeric_state", entity_id: "sensor.temperature", above: 18, below: 24 },
      { condition: "time", after: "08:00:00", before: "22:00:00", weekday: ["mon", "tue"] },
    ];
    expect(visualToConditions(conditionsToVisual(source)!)).toEqual(source);
  });

  it("round trips a basic OR group", () => {
    const source = [{ condition: "or", conditions: [
      { condition: "state", entity_id: "person.alex", state: "home" },
      { condition: "state", entity_id: "person.sam", state: "home" },
    ] }];
    expect(visualToConditions(conditionsToVisual(source)!)).toEqual(source);
  });

  it("round trips an explicit basic AND group", () => {
    const source = [{ condition: "and", conditions: [
      { condition: "state", entity_id: "person.alex", state: "home" },
      { condition: "time", after: "08:00:00" },
    ] }];
    expect(visualToConditions(conditionsToVisual(source)!)).toEqual(source);
  });

  it("rejects unsupported condition options and nested groups", () => {
    expect(conditionsToVisual([{ condition: "state", entity_id: "x", state: "on", for: { minutes: 5 } }])).toBeUndefined();
    expect(conditionsToVisual([{ condition: "and", conditions: [{ condition: "template", value_template: "{{ true }}" }] }])).toBeUndefined();
    expect(conditionsToVisual([{ condition: "numeric_state", entity_id: "sensor.x", above: "input_number.limit" }])).toBeUndefined();
    expect(conditionsToVisual([{ condition: "time", after: "input_datetime.start" }])).toBeUndefined();
  });
});

describe("editor helpers", () => {
  it("parses common scalar service data values", () => {
    expect(["42", "true", "hello", "null"].map(parsePrimitive)).toEqual([42, true, "hello", null]);
  });

  it("keeps friendly errors and technical detail separate", () => {
    expect(friendlyError(new Error("expected_revision does not match"))).toEqual({
      message: "This action changed elsewhere. Close the editor, reopen it, and try again.",
      details: "expected_revision does not match",
    });
  });
});
