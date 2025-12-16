import { Router } from "express";
import * as organizationController from "../../controllers/v1/organization.controller";

const router = Router();

router.post("/create", organizationController.createOrganization);

export default router;
