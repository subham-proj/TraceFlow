import { Router } from "express";
import * as ingestController from "../../controllers/v1/ingest.controller";

const router = Router();

// POST /v1/ingest
router.post("/ingest", ingestController.ingestEvents);

export default router;
