import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import * as logger from "../../utils/logger";
import { getPlanLimits } from "../../utils/subscription";

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
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

    if (!name) {
      res.status(400).json({
        status: "error",
        message: "Organization name is required",
      });
      return;
    }

    // Check Plan Limits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { organizations: true },
        },
      },
    });

    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const orgCount = user._count.organizations;
    const plan = user.plan;

    const { maxOrgs } = getPlanLimits(plan);

    if (orgCount >= maxOrgs) {
      res.status(403).json({
        status: "error",
        message: `Plan limit reached. You can only create ${maxOrgs} organizations on ${plan} plan.`,
      });
      return;
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    logger.info(`Organization created: ${organization.id} by User: ${userId}`);

    res.status(201).json({
      status: "success",
      data: organization,
    });
  } catch (error) {
    logger.error("Error creating organization:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
