import { Router } from "express";
import * as ingestController from "../../controllers/v1/ingest.controller";

const router = Router();

router.post("/", ingestController.ingestEvents);

export default router;
