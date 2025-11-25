import {
  TraceFlowOptions,
  TraceEvent,
  BatchPayload,
  TraceFlowInstance,
} from "./types";
import { sendBatch } from "./Transport";
import {
  DEFAULT_BATCH_SIZE,
  DEFAULT_COLLECTOR_URL,
  DEFAULT_ENABLE_DISK_FALLBACK,
  DEFAULT_FLUSH_INTERVAL_MS,
  LOG_PREFIX,
} from "./constants";

export const TraceFlowSDK = (
  userOptions: TraceFlowOptions
): TraceFlowInstance => {
  const options = {
    batch_size: DEFAULT_BATCH_SIZE,
    flush_interval_ms: DEFAULT_FLUSH_INTERVAL_MS,
    enable_disk_fallback: DEFAULT_ENABLE_DISK_FALLBACK,
    collector_url: DEFAULT_COLLECTOR_URL,
    ...userOptions,
  };

  let buffer: TraceEvent[] = [];
  let flushTimer: NodeJS.Timeout | null = null;

  const flush = async (): Promise<void> => {
    if (buffer.length === 0) return;

    const eventsToSend = [...buffer];
    buffer = []; // Clear buffer immediately

    const payload: BatchPayload = {
      org_id: options.org_id,
      project_id: options.project_id,
      events: eventsToSend,
    };

    console.log(`${LOG_PREFIX} Flushing ${eventsToSend.length} events...`);

    // Call the functional transport
    await sendBatch(
      payload,
      options.collector_url || DEFAULT_COLLECTOR_URL,
      options.enable_disk_fallback
    );
  };

  const startFlushTimer = (): void => {
    if (flushTimer) clearInterval(flushTimer);
    flushTimer = setInterval(() => {
      flush();
    }, options.flush_interval_ms || DEFAULT_FLUSH_INTERVAL_MS);
  };

  const processEvent = (event: TraceEvent): void => {
    // Add default fields if missing
    const enrichedEvent: TraceEvent = {
      ...event,
      service: options.service_name,
    };

    buffer.push(enrichedEvent);

    if (buffer.length >= (options.batch_size || DEFAULT_BATCH_SIZE)) {
      flush();
    }
  };

  const shutdown = (): void => {
    if (flushTimer) clearInterval(flushTimer);
    flush();
  };

  // Initialize
  startFlushTimer();

  return {
    processEvent,
    shutdown,
  };
};
