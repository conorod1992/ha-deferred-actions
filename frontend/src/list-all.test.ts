import { describe, expect, it, vi } from "vitest";
import { listJobs } from "./api";
import type { HomeAssistant } from "./types";

describe("listJobs", () => {
  it("requests the complete queue instead of silently truncating it", async () => {
    const response = { count: 1500, jobs: [], more: false };
    const callWS = vi.fn().mockResolvedValue(response);
    const hass = { callWS } as unknown as HomeAssistant;

    expect(await listJobs(hass)).toBe(response);
    expect(callWS).toHaveBeenCalledWith({ type: "deferred_actions/list", data: { limit: null } });
  });
});
