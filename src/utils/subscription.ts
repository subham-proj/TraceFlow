import { Plan } from "@prisma/client";

export const SUBSCRIPTION_LIMITS = {
  [Plan.BASIC]: {
    maxOrgs: 1,
    maxProjectsPerOrg: 3,
  },
  [Plan.PRO]: {
    maxOrgs: 3,
    maxProjectsPerOrg: 5,
  },
  [Plan.PREMIUM]: {
    maxOrgs: 10,
    maxProjectsPerOrg: Infinity,
  },
};

export const getPlanLimits = (plan: Plan) => {
  return SUBSCRIPTION_LIMITS[plan] || SUBSCRIPTION_LIMITS[Plan.BASIC];
};
