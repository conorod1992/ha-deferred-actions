import { beforeAll, describe, expect, it } from "vitest";
import { sequenceToVisual } from "./editor-model";
import type { DeferredJob, HomeAssistant } from "./types";

let DeferredActionsPanel: typeof import("./deferred-actions-panel").DeferredActionsPanel;

beforeAll(async () => {
  Object.assign(globalThis, {
    HTMLElement: class {},
    customElements: { define: () => undefined },
  });
  ({ DeferredActionsPanel } = await import("./deferred-actions-panel"));
});

describe("editor preview", () => {
  it("uses an existing job's current unsaved visual action and condition edits", () => {
    const job = {
      sequence: [{ action: "light.turn_on" }],
      conditions: [],
      condition_failure: "skip",
      execute_at: "2026-01-01T12:00:00Z",
    } as unknown as DeferredJob;
    const panel = new DeferredActionsPanel() as unknown as Record<string, unknown>;
    panel.hass = { config: { time_zone: "UTC" } } as HomeAssistant;
    (panel.openEditor as (value: DeferredJob) => void)(job);
    panel.visualActions = sequenceToVisual([{ action: "light.turn_off" }]);
    panel.visualConditions = { operator: "and", items: [{ type: "state", entity_id: "binary_sensor.home", state: "on", metadata: {} }] };
    panel.conditionFailure = "fail";

    const preview = (panel.editorPreview as (value: DeferredJob) => string)(job);
    expect(preview).toContain("Run light.turn_off");
    expect(preview).not.toContain("Run light.turn_on");
    expect(preview).toContain("Conditions are checked at run time; if unmet, the job fails.");
  });

  it("keeps compact section summaries in sync with editor state", () => {
    const panel = new DeferredActionsPanel() as unknown as Record<string, unknown>;
    panel.hass = { config: { time_zone: "UTC" } } as HomeAssistant;
    (panel.openEditor as () => void)();

    expect((panel.editorScheduleStatus as () => string)()).toBe("In 20 minutes");
    expect((panel.editorActionStatus as () => string)()).toBe("1 action");
    expect((panel.editorConditionCount as () => number | undefined)()).toBe(0);

    panel.previewDelay = 1;
    panel.previewUnit = "hours";
    panel.visualActions = sequenceToVisual([
      { action: "light.turn_on" },
      { action: "light.turn_off" },
    ]);
    panel.visualConditions = {
      operator: "and",
      items: [{ type: "state", entity_id: "binary_sensor.home", state: "on", metadata: {} }],
    };

    expect((panel.editorScheduleStatus as () => string)()).toBe("In 1 hour");
    expect((panel.editorActionStatus as () => string)()).toBe("2 actions");
    expect((panel.editorConditionCount as () => number | undefined)()).toBe(1);

    panel.conditionMode = "yaml";
    panel.conditionsYaml = "[";
    expect((panel.editorConditionCount as () => number | undefined)()).toBeUndefined();
  });
});
