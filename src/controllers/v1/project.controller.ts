import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import * as logger from "../../utils/logger";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, orgId } = req.body;
    logger.info(`Creating project: ${name} for Org: ${orgId}`);

    if (!name || !orgId) {
      res.status(400).json({
        status: "error",
        message: "Project name and organization ID are required",
      });
      return;
    }

    // Verify Organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
    });

    if (!organization) {
      res.status(404).json({
        status: "error",
        message: "Organization not found",
      });
      return;
    }

    const project = await prisma.project.create({
      data: {
        name,
        orgId,
      },
    });

    logger.info(`Project created: ${project.id} for Org: ${orgId}`);

    res.status(201).json({
      status: "success",
      data: project,
    });
  } catch (error) {
    logger.error("Error creating project:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
