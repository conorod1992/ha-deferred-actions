export interface HomeAssistant {
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  connection: {
    subscribeMessage<T>(callback: (event: T) => void, message: Record<string, unknown>): Promise<() => void>;
  };
}

export type JobStatus = "pending" | "paused" | "executing" | "completed" | "cancelled" | "failed" | "missed";

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
  attribution: Record<string, unknown>;
  linkage: Record<string, unknown>;
  last_error?: string;
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
