import { Request, Response, NextFunction } from "express";
import { TraceFlowInstance, TraceEvent } from "./types";
import * as crypto from "crypto";

export const traceFlowMiddleware = (sdk: TraceFlowInstance) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const traceId =
      (req.headers["x-trace-id"] as string) || crypto.randomUUID();

    // Attach traceId to response headers
    res.setHeader("x-trace-id", traceId);

    res.on("finish", () => {
      const duration = Date.now() - start;
      const userId =
        (req as any).user?.id || (req.headers["x-user-id"] as string);

      const event: TraceEvent = {
        timestamp: new Date(start).toISOString(),
        endpoint: req.path,
        method: req.method,
        status: res.statusCode,
        latency_ms: duration,
        trace_id: traceId,
        user_id: userId,
        response_size: parseInt(res.get("content-length") || "0", 10),
        tags: {
          // Add any other relevant tags
          userAgent: req.get("user-agent") || "unknown",
        },
      };

      sdk.processEvent(event);
    });

    next();
  };
};
