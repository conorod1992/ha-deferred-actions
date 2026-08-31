import { beforeAll, describe, expect, it, vi } from "vitest";
import type { DeferredJob, PushEvent, QueueSummary } from "./types";

let DeferredActionsPanel: typeof import("./deferred-actions-panel").DeferredActionsPanel;

beforeAll(async () => {
  Object.assign(globalThis, {
    HTMLElement: class {},
    customElements: { define: () => undefined },
  });
  ({ DeferredActionsPanel } = await import("./deferred-actions-panel"));
});

describe("panel synchronization", () => {
  it("keeps an authoritative queue summary instead of recalculating over it", () => {
    const panel = new DeferredActionsPanel() as unknown as Record<string, unknown>;
    const summary: QueueSummary = { pending: 12, paused: 3, failed: 2, next_job_name: "Server next" };

    (panel.handlePush as (event: PushEvent) => void)({ event: "queue_summary", summary });

    expect(panel.summary).toBe(summary);
  });

  it("refreshes the queue when history is cleaned", () => {
    const panel = new DeferredActionsPanel() as unknown as Record<string, unknown>;
    const refresh = vi.fn().mockResolvedValue(undefined);
    panel.refresh = refresh;

    (panel.handlePush as (event: PushEvent) => void)({ event: "history_cleaned" });

    expect(refresh).toHaveBeenCalledOnce();
  });

  it("buffers job events while a full refresh is in flight", () => {
    const panel = new DeferredActionsPanel() as unknown as Record<string, unknown>;
    const job = { id: "job-1", status: "pending" } as DeferredJob;
    panel.jobs = [job];
    panel.refreshing = true;

    (panel.handlePush as (event: PushEvent) => void)({ event: "job_deleted", job_id: "job-1" });

    expect(panel.jobs).toEqual([job]);
    expect(panel.bufferedPush).toEqual([{ event: "job_deleted", job_id: "job-1" }]);
  });
});
