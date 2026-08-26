import { describe, expect, it } from "vitest";
import { buildJobPreview, effectiveOverdueLabel, groupActiveJobs, historyOutcome, isHistoryStatus, matchesJobSearch, relativeTime, resolutionHints, sequenceSummary, snoozePresets } from "./format";
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
    expect(effectiveOverdueLabel(job)).toBe("Run only if less than 5 minutes late (inherited)");
    job.overdue_policy = "skip";
    job.effective_overdue_policy = "skip";
    expect(effectiveOverdueLabel(job)).toBe("Don’t run (job override)");
  });

  it("uses only explicit resolution hints", () => {
    const job = {
      target_entities: ["light.office", "switch.dynamic_hint"],
      explicit_target_entities: ["switch.dynamic_hint"],
    } as DeferredJob;
    expect(resolutionHints(job)).toEqual(["switch.dynamic_hint"]);
    expect(resolutionHints()).toEqual([]);
  });

  it("groups active jobs against the Home Assistant timezone", () => {
    const job = (id: string, execute_at: string) => ({ id, execute_at } as DeferredJob);
    const groups = groupActiveJobs([
      job("overdue", "2026-01-01T06:00:00Z"),
      job("next", "2026-01-01T08:30:00Z"),
      job("today", "2026-01-02T04:00:00Z"),
      job("tomorrow", "2026-01-02T08:00:00Z"),
      job("later", "2026-01-03T08:00:00Z"),
    ], new Date("2026-01-01T08:00:00Z"), "America/Los_Angeles");
    expect(groups.map((group) => [group.label, group.jobs.map((item) => item.id)])).toEqual([
      ["Overdue", ["overdue"]], ["Next", ["next"]], ["Later today", ["today"]], ["Tomorrow", ["tomorrow"]], ["Later", ["later"]],
    ]);
  });

  it("keeps paused jobs out of execution-time buckets", () => {
    const job = (id: string, status: DeferredJob["status"], execute_at: string) => ({ id, status, execute_at } as DeferredJob);
    const groups = groupActiveJobs([
      job("paused", "paused", "2026-01-01T07:00:00Z"),
      job("pending", "pending", "2026-01-01T08:30:00Z"),
    ], new Date("2026-01-01T08:00:00Z"), "UTC");
    expect(groups.map((group) => [group.label, group.jobs.map((item) => item.id)])).toEqual([
      ["Paused", ["paused"]],
      ["Next", ["pending"]],
    ]);
  });

  it("searches user-facing metadata and resolved targets", () => {
    const job = { name: "Office heater", description: "Warm morning", job_key: "heat-office", tags: ["climate"], target_entities: ["switch.office"], explicit_target_entities: [] } as unknown as DeferredJob;
    expect(matchesJobSearch(job, "HEAT-OFFICE")).toBe(true);
    expect(matchesJobSearch(job, "switch.office")).toBe(true);
    expect(matchesJobSearch(job, "bedroom")).toBe(false);
  });

  it("uses plain-language terminal outcomes", () => {
    expect(historyOutcome({ status: "skipped", terminal_reason: "conditions not met" } as DeferredJob)).toBe("Skipped because conditions were not met");
    expect(historyOutcome({ status: "cancelled", terminal_reason: "replaced by job 2" } as DeferredJob)).toBe("Replaced by another scheduled action");
    expect(historyOutcome({ status: "failed", last_error: "execution interrupted by restart" } as DeferredJob)).toBe("Interrupted while running");
  });
});

describe("whole-job preview", () => {
  it("summarizes basic and complex action sequences deterministically", () => {
    expect(sequenceSummary([{ action: "light.turn_off" }])).toBe("Run light.turn_off");
    expect(sequenceSummary([{ if: [], then: [] }, { delay: 5 }, { parallel: [] }])).toBe("Run 3 steps (If / Then, Delay, Parallel) in order");
  });

  it("includes schedule, condition failure, overdue, and valid-until behavior", () => {
    expect(buildJobPreview({ sequence: [{ action: "switch.turn_off" }], when: "In 20 minutes", hasConditions: true, conditionFailure: "fail", overdue: "Run only within 5 minutes", validUntil: "10:30 PM" })).toBe(
      "In 20 minutes: Run switch.turn_off. Conditions are checked at run time; if unmet, the job fails. Run only within 5 minutes. It will not run after 10:30 PM.",
    );
  });

  it("describes Run For as start then end", () => {
    expect(buildJobPreview({ sequence: [], when: "Now", runFor: { start: "light.turn_on", end: "light.turn_off", duration: "15 minutes" } })).toBe("Now: Run light.turn_on, then light.turn_off after 15 minutes.");
  });
});
