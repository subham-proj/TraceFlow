import { Router } from "express";
import ingestRoutes from "./ingest.routes";

const router = Router();

// Mount feature routes
router.use("/", ingestRoutes);

export default router;
