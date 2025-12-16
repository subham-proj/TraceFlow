import { Router } from "express";
import * as organizationController from "../../controllers/v1/organization.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/create", authenticate, organizationController.createOrganization);

export default router;
