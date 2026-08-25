import type { DeferredJob, HomeAssistant, ListResponse, PushEvent } from "./types";

const command = <T>(hass: HomeAssistant, operation: string, data: Record<string, unknown> = {}): Promise<T> =>
  hass.callWS<T>({ type: `deferred_actions/${operation}`, data });

export const listJobs = (hass: HomeAssistant): Promise<ListResponse> => command(hass, "list", { limit: 1000 });
export const createJob = (hass: HomeAssistant, data: Record<string, unknown>): Promise<{ job: DeferredJob }> => command(hass, "create", data);
export const runFor = (hass: HomeAssistant, data: Record<string, unknown>): Promise<unknown> =>
  hass.callService("deferred_actions", "run_for", data, undefined, true, true);
export const updateJob = (hass: HomeAssistant, data: Record<string, unknown>): Promise<{ job: DeferredJob }> => command(hass, "update", data);
export const operateJob = (hass: HomeAssistant, operation: string, jobId: string, data: Record<string, unknown> = {}): Promise<{ job: DeferredJob }> =>
  command(hass, operation, { job_id: jobId, ...data });
export const subscribeJobs = (hass: HomeAssistant, callback: (event: PushEvent) => void): Promise<() => void> =>
  hass.connection.subscribeMessage(callback, { type: "deferred_actions/subscribe" });
