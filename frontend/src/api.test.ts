import { describe, expect, it, vi } from "vitest";
import { runFor } from "./api";
import type { HomeAssistant } from "./types";

describe("runFor", () => {
  it("uses the existing response-only Home Assistant service", async () => {
    const callService = vi.fn().mockResolvedValue({ response: { job: { id: "job-1" } } });
    const hass = { callService } as unknown as HomeAssistant;
    const data = {
      name: "Office heater timer",
      duration: { minutes: 30 },
      start_sequence: [{ action: "switch.turn_on", target: { entity_id: "switch.office" } }],
      end_sequence: [{ action: "switch.turn_off", target: { entity_id: "switch.office" } }],
    };

    await runFor(hass, data);

    expect(callService).toHaveBeenCalledWith("deferred_actions", "run_for", data, undefined, true, true);
  });
});
