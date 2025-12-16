import { Request, Response } from "express";
import * as logger from "../../utils/logger";
import * as ingestService from "../../services/ingest.service";
import { validatePayload } from "../../utils/validation";
import { produceEvent } from "../../lib/kafka";

export const ingestEvents = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    // Validate payload
    const validationError = validatePayload(payload);
    if (validationError) {
      res.status(400).json({
        status: "error",
        message: validationError,
      });
      return;
    }

    // Enrich events
    if (payload.events) {
      payload.events = await ingestService.enrichEvents(
        payload.events,
        req.ip || "unknown"
      );
    }

    // Produce to Kafka
    await produceEvent(payload);

    logger.info(
      "Received ingestion payload:",
      JSON.stringify(payload, null, 2)
    );

    // TODO: Process events
    // - Validate event schema
    // - Write to database
    // - Push to message queue
    // - Update metrics/analytics

    res.status(202).json({
      status: "accepted",
      message: "Events received for processing",
      received_at: new Date().toISOString(),
      event_count: payload.events?.length || 0,
    });
  } catch (error) {
    logger.error("Ingestion error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error during ingestion",
    });
  }
};
