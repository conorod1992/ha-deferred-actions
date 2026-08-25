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

export const localDate = (iso: string): string => new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium", timeStyle: "short",
}).format(new Date(iso));

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
