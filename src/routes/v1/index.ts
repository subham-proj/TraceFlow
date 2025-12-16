import { Router } from "express";
import ingestRoutes from "./ingest.routes";
import authRoutes from "./auth.routes";
import organizationRoutes from "./organization.routes";
import projectRoutes from "./project.routes";

const router = Router();

router.use("/ingest", ingestRoutes);
router.use("/auth", authRoutes);
router.use("/org", organizationRoutes);
router.use("/projects", projectRoutes);

export default router;
