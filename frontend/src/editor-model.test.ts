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

  it("preserves unsupported nodes as YAML-required blocks", () => {
    const source = [{ action: "light.turn_on", data: { transition: { seconds: 2 } } }];
    const visual = sequenceToVisual(source);
    expect(visual[0]?.kind).toBe("unsupported");
    expect(visualToSequence(visual)).toEqual(source);
  });

  it("losslessly round trips nested If, Choose, Repeat, Parallel, Delay, and Wait blocks", () => {
    const sequence = [{
      alias: "Top-level choice",
      choose: [{ alias: "At home", conditions: [{ condition: "zone", entity_id: "person.alex", zone: "zone.home" }], sequence: [
        { if: [{ condition: "sun", after: "sunset", after_offset: "-00:10:00" }], then: [{ action: "light.turn_on", target: { entity_id: "light.porch" } }], else: [{ delay: { seconds: 5 } }] },
        { repeat: { count: "{{ count }}", sequence: [{ wait_template: "{{ is_state('binary_sensor.ready', 'on') }}", timeout: 30, continue_on_timeout: false }] } },
      ] }],
      default: [{ parallel: [
        { action: "notify.alex", data: { message: "Away" } },
        { alias: "Lights", sequence: [{ action: "light.turn_off", target: { area_id: ["downstairs"] } }] },
      ] }],
    }];
    expect(visualToSequence(sequenceToVisual(sequence))).toEqual(sequence);
  });

  it("preserves unsupported nested conditions without forcing the whole sequence to YAML", () => {
    const sequence = [{ if: [{ condition: "template", value_template: "{{ true }}" }], then: [{ action: "script.safe" }] }];
    const visual = sequenceToVisual(sequence);
    expect(visual[0]?.kind).toBe("if");
    expect(visualToSequence(visual)).toEqual(sequence);
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

  it("round trips nested logical, zone, sun, aliases, and unsupported conditions", () => {
    const source = [{ condition: "and", alias: "Safety", conditions: [
      { condition: "or", conditions: [{ condition: "zone", entity_id: "person.alex", zone: "zone.home" }, { condition: "sun", after: "sunset" }] },
      { condition: "not", conditions: [{ condition: "template", value_template: "{{ is_state('alarm_control_panel.home', 'triggered') }}" }] },
    ] }];
    expect(visualToConditions(conditionsToVisual(source))).toEqual(source);
  });

  it("preserves unsupported options as YAML-required condition nodes", () => {
    const source = [{ condition: "state", entity_id: "x", state: "on", for: { minutes: 5 } }];
    expect(conditionsToVisual(source).items[0]?.type).toBe("unsupported");
    expect(visualToConditions(conditionsToVisual(source))).toEqual(source);
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
