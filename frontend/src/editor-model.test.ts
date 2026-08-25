import { describe, expect, it } from "vitest";
import { conditionsToVisual, dataEntry, dataEntryValue, dataEntryWithType, presentError, sequenceToVisual, UserFacingError, visualToConditions, visualToSequence } from "./editor-model";

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

  it("preserves unchanged existing scalar action data losslessly", () => {
    const sequence = [{ action: "test.service", data: { code: "00123", literal: "true", count: 42, enabled: true, empty: null } }];
    expect(visualToSequence(sequenceToVisual(sequence)!)).toEqual(sequence);
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
  it("keeps numeric-looking and boolean-looking text as text", () => {
    expect(dataEntryValue({ key: "code", type: "text", value: "", raw: "00123" })).toBe("00123");
    expect(dataEntryValue({ key: "literal", type: "text", value: "", raw: "true" })).toBe("true");
  });

  it("preserves explicit scalar types", () => {
    expect(dataEntryValue(dataEntry("count", 42))).toBe(42);
    expect(dataEntryValue(dataEntry("enabled", true))).toBe(true);
    expect(dataEntryValue(dataEntry("empty", null))).toBeNull();
    expect(dataEntryWithType(dataEntry("new", ""), "text").type).toBe("text");
  });

  it("rejects non-finite number fields with a local message", () => {
    expect(() => dataEntryValue({ key: "temperature", type: "number", value: 0, raw: "not a number" })).toThrow("Enter a finite number for “temperature”.");
  });

  it("shows local validation errors verbatim", () => {
    expect(presentError(new UserFacingError("Duration must be greater than zero"))).toEqual({ message: "Duration must be greater than zero" });
  });

  it("keeps friendly backend errors and technical detail separate", () => {
    expect(presentError(new Error("expected_revision does not match"))).toEqual({
      message: "This action changed elsewhere. Close the editor, reopen it, and try again.",
      details: "expected_revision does not match",
    });
  });

  it("uses the fallback wording for generic backend errors", () => {
    expect(presentError(new Error("gateway exploded"))).toEqual({
      message: "Home Assistant couldn’t save this deferred action.",
      details: "gateway exploded",
    });
  });
});
