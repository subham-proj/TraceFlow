import { Router } from "express";
import * as projectController from "../../controllers/v1/project.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticate, projectController.createProject);

export default router;
