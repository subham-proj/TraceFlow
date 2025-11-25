import * as dotenv from "dotenv";
dotenv.config();

export const DEFAULT_COLLECTOR_URL =
  process.env.TRACEFLOW_COLLECTOR_URL || "http://localhost:3000/v1/ingest";
export const DEFAULT_BATCH_SIZE = parseInt(
  process.env.TRACEFLOW_BATCH_SIZE || "100",
  10
);
export const DEFAULT_FLUSH_INTERVAL_MS = parseInt(
  process.env.TRACEFLOW_FLUSH_INTERVAL_MS || "2000",
  10
);
export const DEFAULT_ENABLE_DISK_FALLBACK =
  process.env.TRACEFLOW_ENABLE_DISK_FALLBACK !== "false";

export const LOG_PREFIX = "[TraceFlow]";
export const ERROR_PREFIX = "[TraceFlow Error]";
