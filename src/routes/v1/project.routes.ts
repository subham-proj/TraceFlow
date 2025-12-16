import { Router } from "express";
import * as projectController from "../../controllers/v1/project.controller";

const router = Router();

router.post("/create", projectController.createProject);

export default router;
