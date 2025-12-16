import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import * as logger from "../../utils/logger";

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        status: "error",
        message: "Organization name is required",
      });
      return;
    }

    const organization = await prisma.organization.create({
      data: {
        name,
      },
    });

    logger.info(`Organization created: ${organization.id}`);

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
