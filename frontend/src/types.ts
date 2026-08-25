export interface HomeAssistant {
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  callService<T = unknown>(domain: string, service: string, serviceData?: Record<string, unknown>, target?: Record<string, unknown>, notifyOnError?: boolean, returnResponse?: boolean): Promise<T>;
  connection: {
    subscribeMessage<T>(callback: (event: T) => void, message: Record<string, unknown>): Promise<() => void>;
  };
}

export type JobStatus = "pending" | "paused" | "executing" | "completed" | "cancelled" | "failed" | "missed" | "skipped" | "expired";

export interface DeferredJob {
  id: string;
  name: string;
  description?: string;
  status: JobStatus;
  execute_at: string;
  execute_at_local: string;
  created_at: string;
  modified_at: string;
  completed_at?: string;
  sequence: Record<string, unknown>[];
  action_summary: string;
  seconds_remaining: number;
  job_key?: string;
  tags: string[];
  source: string;
  target_entities: string[];
  explicit_target_entities: string[];
  condition_entities: string[];
  conditions: Record<string, unknown>[];
  has_conditions: boolean;
  condition_failure: "skip" | "cancel" | "fail";
  overdue_policy?: "execute" | "skip" | "execute_within_grace";
  overdue_grace?: Record<string, number>;
  effective_overdue_policy: "execute" | "skip" | "execute_within_grace";
  effective_overdue_grace_minutes: number;
  valid_until?: string;
  valid_until_local?: string;
  attribution: Record<string, unknown>;
  linkage: Record<string, unknown>;
  last_error?: string;
  terminal_reason?: string;
  revision: number;
}

export interface QueueSummary {
  pending: number;
  paused: number;
  failed: number;
  next_job_name?: string;
  next_execution_local?: string;
}

export interface ListResponse { count: number; jobs: DeferredJob[]; more: boolean }
export interface PushEvent { event: string; job?: DeferredJob; job_id?: string; summary?: QueueSummary }
