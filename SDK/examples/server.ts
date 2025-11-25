import express from "express";
import { TraceFlowSDK, traceFlowMiddleware } from "../src"; // Importing from src for direct usage with ts-node

const app = express();
const port = 3001;

// Initialize SDK using factory function
const sdk = TraceFlowSDK({
  org_id: "org_123",
  project_id: "proj_abc",
  service_name: "example-service",
  collector_url: "http://localhost:9999/v1/ingest", // Intentionally invalid port to test retries/fallback
  batch_size: 5, // Small batch size for testing
  flush_interval_ms: 5000,
});

// Use Middleware
app.use(traceFlowMiddleware(sdk));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/error", (req, res) => {
  res.status(500).send("Something went wrong");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
