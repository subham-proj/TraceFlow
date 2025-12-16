import { prisma } from "../lib/prisma";
import * as logger from "../utils/logger";

export const processTraceEvent = async (message: string | undefined) => {
  if (!message) return;

  try {
    const payload = JSON.parse(message);
    const { org_id, project_id, events } = payload;

    logger.info(
      `Processing ${
        events?.length || 0
      } events for org: ${org_id}, project: ${project_id}`
    );

    if (!events || events.length === 0) return;

    const traceEvents = events.map((event: any) => ({
      orgId: org_id,
      projectId: project_id,
      serviceName: event.service,
      endpoint: event.endpoint,
      method: event.method,
      status: event.status,
      latencyMs: event.latency_ms,
      responseSize: event.response_size,
      traceId: event.trace_id,
      tags: event.tags,
      timestamp: new Date(event.timestamp),
    }));

    await prisma.traceEvent.createMany({
      data: traceEvents,
      skipDuplicates: true, // Optional: skip if traceId already exists
    });

    logger.info(`Successfully inserted ${traceEvents.length} events to DB`);
  } catch (error) {
    logger.error("Error processing trace event:", error);
  }
};
