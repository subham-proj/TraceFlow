export interface TraceFlowOptions {
  org_id: string;
  project_id: string;
  service_name: string;
  collector_url?: string;
  batch_size?: number;
  flush_interval_ms?: number;
  enable_disk_fallback?: boolean;
}

export interface TraceEvent {
  timestamp: string; // ISO string
  endpoint: string;
  method: string;
  status: number;
  latency_ms: number;
  trace_id?: string;
  user_id?: string;
  tags?: Record<string, string>;
  response_size?: number;
  service?: string;
  env?: string;
}

export interface BatchPayload {
  org_id: string;
  project_id: string;
  events: TraceEvent[];
}

export interface TraceFlowInstance {
  processEvent: (event: TraceEvent) => void;
  shutdown: () => void;
}
