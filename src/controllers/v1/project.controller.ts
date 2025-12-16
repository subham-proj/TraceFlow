import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import * as logger from "../../utils/logger";
import { getPlanLimits } from "../../utils/subscription";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, orgId } = req.body;
    // Assuming auth middleware attaches user to req
    // @ts-ignore
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
      return;
    }

    logger.info(`Creating project: ${name} for Org: ${orgId}`);

    if (!name || !orgId) {
      res.status(400).json({
        status: "error",
        message: "Project name and organization ID are required",
      });
      return;
    }

    // Verify Organization exists and fetch owner
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        owner: true,
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!organization) {
      res.status(404).json({
        status: "error",
        message: "Organization not found",
      });
      return;
    }

    // Check if requester is owner (or add team logic later)
    if (organization.ownerId !== userId) {
      res.status(403).json({
        status: "error",
        message:
          "You do not have permission to add projects to this organization",
      });
      return;
    }

    // Check Plan Limits based on Owner's plan
    const plan = organization.owner.plan;
    const projectCount = organization._count.projects;

    const { maxProjectsPerOrg } = getPlanLimits(plan);

    if (projectCount >= maxProjectsPerOrg) {
      res.status(403).json({
        status: "error",
        message: `Plan limit reached. You can only create ${maxProjectsPerOrg} projects per organization on ${plan} plan.`,
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
