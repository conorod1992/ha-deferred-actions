import { describe, expect, it } from "vitest";
import { effectiveOverdueLabel, isHistoryStatus, relativeTime, snoozePresets } from "./format";
import type { DeferredJob } from "./types";

describe("relativeTime", () => {
  it("formats future minutes", () => {
    expect(relativeTime("2026-01-01T00:20:00Z", Date.parse("2026-01-01T00:00:00Z"))).toBe("in 20 minutes");
  });
  it("formats overdue times", () => {
    expect(relativeTime("2026-01-01T00:00:00Z", Date.parse("2026-01-01T00:01:00Z"))).toBe("overdue by 1 minute");
  });
});

describe("job presentation", () => {
  it("includes skipped and expired in history", () => {
    expect(isHistoryStatus("skipped")).toBe(true);
    expect(isHistoryStatus("expired")).toBe(true);
    expect(isHistoryStatus("pending")).toBe(false);
  });

  it("provides compact snooze presets", () => {
    expect(snoozePresets).toEqual([5, 15, 30, 60]);
  });

  it("explains effective overdue inheritance", () => {
    const job = {
      effective_overdue_policy: "execute_within_grace",
      effective_overdue_grace_minutes: 5,
    } as DeferredJob;
    expect(effectiveOverdueLabel(job)).toBe("Execute within 5 minutes (inherited)");
    job.overdue_policy = "skip";
    job.effective_overdue_policy = "skip";
    expect(effectiveOverdueLabel(job)).toBe("skip (job override)");
  });
});
