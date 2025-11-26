import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { BatchPayload } from "./types";
import * as logger from "./utils/logger";

const DISK_BUFFER_PATH = path.join(os.tmpdir(), "traceflow-buffer");

// Ensure disk buffer directory exists if fallback is enabled
const ensureDiskBuffer = async () => {
  try {
    await fs.promises.access(DISK_BUFFER_PATH);
  } catch {
    await fs.promises.mkdir(DISK_BUFFER_PATH, { recursive: true });
  }
};

export const sendBatch = async (
  payload: BatchPayload,
  collectorUrl: string,
  enableDiskFallback: boolean = true
): Promise<void> => {
  try {
    await sendWithRetry(payload, collectorUrl);
  } catch (error) {
    logger.error("Failed to send batch after retries:", error);
    if (enableDiskFallback) {
      await saveToDiskAsync(payload);
    }
  }
};

const sendWithRetry = async (
  payload: BatchPayload,
  url: string,
  retries = 3,
  delay = 1000
): Promise<void> => {
  try {
    await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 5000, // 5s timeout
    });
  } catch (error: any) {
    if (retries > 0) {
      // Retry on network errors or 5xx server errors
      if (!error.response || error.response.status >= 500) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return sendWithRetry(payload, url, retries - 1, delay * 2);
      }
    }
    throw error;
  }
};

const saveToDiskAsync = async (payload: BatchPayload): Promise<void> => {
  try {
    await ensureDiskBuffer();
    const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const filename = `batch-${id}.json`;
    const tempFilename = `batch-${id}.tmp`;

    const filepath = path.join(DISK_BUFFER_PATH, filename);
    const tempFilepath = path.join(DISK_BUFFER_PATH, tempFilename);

    // Atomic write pattern: Write to temp file -> Rename to final file
    await fs.promises.writeFile(tempFilepath, JSON.stringify(payload));
    await fs.promises.rename(tempFilepath, filepath);

    logger.info(`Saved batch to disk (atomic): ${filepath}`);
  } catch (err) {
    logger.error("Failed to save batch to disk:", err);
  }
};
