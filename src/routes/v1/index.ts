import { Router } from "express";
import ingestRoutes from "./ingest.routes";
import authRoutes from "./auth.routes";

const router = Router();

router.use("/ingest", ingestRoutes);
router.use("/auth", authRoutes);

export default router;
