import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import routes from "./routes";
import * as logger from "./utils/logger";

dotenv.config();

const app = express();
const port = process.env.PORT || 9999;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" })); // Increased limit for batch payloads

// Routes
app.use("/api", routes);

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Start Server
app.listen(port, () => {
  logger.info(`Ingestion server running on port ${port}`);
});
