import * as logger from "../utils/logger";

export const processTraceEvent = async (message: string | undefined) => {
  if (!message) return;

  try {
    const event = JSON.parse(message);
    logger.info("Processing trace event:", JSON.stringify(event, null, 2));

    // TODO: Add further processing logic here (e.g., save to DB)
  } catch (error) {
    logger.error("Error processing trace event:", error);
  }
};
