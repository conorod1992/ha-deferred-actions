export function relativeTime(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const absolute = Math.abs(seconds);
  const [amount, unit] = absolute >= 86400
    ? [Math.round(absolute / 86400), "day"]
    : absolute >= 3600
      ? [Math.round(absolute / 3600), "hour"]
      : absolute >= 60
        ? [Math.round(absolute / 60), "minute"]
        : [absolute, "second"];
  return `${seconds < 0 ? "overdue by" : "in"} ${amount} ${unit}${amount === 1 ? "" : "s"}`;
}

export const localDate = (iso: string, timeZone?: string): string => new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium", timeStyle: "short", ...(timeZone ? { timeZone } : {}),
}).format(new Date(iso));

const dateKey = (value: Date, timeZone: string): string => {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(value);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};

export type QueueGroup = "Overdue" | "Next" | "Later today" | "Tomorrow" | "Later";
export const groupActiveJobs = (jobs: DeferredJob[], now = new Date(), timeZone = "UTC"): { label: QueueGroup; jobs: DeferredJob[] }[] => {
  const ordered = [...jobs].sort((a, b) => a.execute_at.localeCompare(b.execute_at));
  const today = dateKey(now, timeZone);
  const [year, month, day] = today.split("-").map(Number);
  const tomorrow = new Date(Date.UTC(year!, month! - 1, day! + 1)).toISOString().slice(0, 10);
  let usedNext = false;
  const groups = new Map<QueueGroup, DeferredJob[]>();
  for (const job of ordered) {
    const time = new Date(job.execute_at);
    let label: QueueGroup;
    if (time.getTime() < now.getTime()) label = "Overdue";
    else if (!usedNext) { label = "Next"; usedNext = true; }
    else { const key = dateKey(time, timeZone); label = key === today ? "Later today" : key === tomorrow ? "Tomorrow" : "Later"; }
    groups.set(label, [...(groups.get(label) ?? []), job]);
  }
  return (["Overdue", "Next", "Later today", "Tomorrow", "Later"] as QueueGroup[]).flatMap((label) => groups.has(label) ? [{ label, jobs: groups.get(label)! }] : []);
};

export const matchesJobSearch = (job: DeferredJob, query: string): boolean => {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  return [job.name, job.description, job.job_key, ...job.tags, ...job.target_entities, ...job.explicit_target_entities]
    .filter(Boolean).some((value) => String(value).toLocaleLowerCase().includes(needle));
};

export const historyOutcome = (job: DeferredJob): string => {
  if (job.status === "completed") return "Completed successfully";
  if (job.status === "cancelled") return /replac/i.test(job.terminal_reason ?? "") ? "Replaced by another scheduled action" : "Cancelled before it ran";
  if (job.status === "missed") return "Missed while Home Assistant was unavailable";
  if (job.status === "skipped") return /condition/i.test(job.terminal_reason ?? "") ? "Skipped because conditions were not met" : "Skipped by its overdue policy";
  if (job.status === "expired") return "Expired after its ‘don’t run after’ time";
  if (job.status === "failed") return /interrupt|restart|shutdown/i.test(`${job.terminal_reason ?? ""} ${job.last_error ?? ""}`) ? "Interrupted while running" : "Failed while running";
  return job.status;
};

const sequenceKind = (raw: Record<string, unknown>): string => typeof raw.action === "string" || typeof raw.service === "string" ? "service call" : raw.if ? "If / Then" : raw.choose ? "Choose" : raw.repeat ? "Repeat" : raw.parallel ? "Parallel" : raw.delay !== undefined ? "Delay" : raw.wait_template ? "Wait for template" : "advanced action";
export const sequenceSummary = (sequence: Record<string, unknown>[]): string => {
  if (!sequence.length) return "No actions configured";
  if (sequence.length === 1) {
    const raw = sequence[0]!; const service = raw.action ?? raw.service;
    return typeof service === "string" ? `Run ${service}` : `Run ${sequenceKind(raw)} block`;
  }
  const kinds = sequence.map(sequenceKind);
  return `Run ${sequence.length} steps (${kinds.slice(0, 3).join(", ")}${kinds.length > 3 ? ", …" : ""}) in order`;
};

export interface JobPreviewOptions { sequence: Record<string, unknown>[]; when: string; hasConditions?: boolean; conditionFailure?: "skip" | "cancel" | "fail"; overdue?: string; validUntil?: string; runFor?: { start: string; end: string; duration: string } }
export const buildJobPreview = (options: JobPreviewOptions): string => {
  const action = options.runFor ? `Run ${options.runFor.start}, then ${options.runFor.end} after ${options.runFor.duration}` : sequenceSummary(options.sequence);
  const conditions = options.hasConditions ? ` Conditions are checked at run time; if unmet, ${options.conditionFailure === "fail" ? "the job fails" : options.conditionFailure === "cancel" ? "the job is cancelled" : "this run is skipped"}.` : "";
  const limits = `${options.overdue ? ` ${options.overdue}.` : ""}${options.validUntil ? ` It will not run after ${options.validUntil}.` : ""}`;
  return `${options.when}: ${action}.${conditions}${limits}`;
};

export const snoozePresets = [5, 15, 30, 60] as const;

export const resolutionHints = (job?: DeferredJob): string[] => job?.explicit_target_entities ?? [];

export const isHistoryStatus = (status: JobStatus): boolean =>
  ["completed", "cancelled", "missed", "skipped", "expired"].includes(status);

export const effectiveOverdueLabel = (job: DeferredJob): string => {
  const inherited = job.overdue_policy ? "job override" : "inherited";
  if (job.effective_overdue_policy === "execute_within_grace") {
    return `Run only if less than ${job.effective_overdue_grace_minutes} minutes late (${inherited})`;
  }
  return `${job.effective_overdue_policy === "execute" ? "Run when Home Assistant comes back" : "Don’t run"} (${inherited})`;
};
import type { DeferredJob, JobStatus } from "./types";
