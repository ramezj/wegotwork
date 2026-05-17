import prisma from "@/lib/prisma";
import plansData from "@/data/plans.json";

const SYSTEM_PLANS = plansData.plans.map((plan) => ({
  id: plan.id,
  code: plan.code,
  name: plan.name,
  maxJobs: plan.quotas.maxJobs,
  maxMembers: plan.quotas.maxMembers,
  maxOffices: plan.quotas.maxOffices,
  maxPipelines: plan.quotas.maxPipelines,
}));

export type SystemPlanCode = (typeof SYSTEM_PLANS)[number]["code"];

type SystemPlanMap = Record<
  SystemPlanCode,
  {
    id: string;
    code: string;
    name: string;
    maxJobs: number;
    maxMembers: number;
    maxOffices: number;
    maxPipelines: number;
  }
>;

export async function ensureSystemPlans(): Promise<SystemPlanMap> {
  return prisma.$transaction(async (tx) => {
    const existingPlans = await tx.plan.findMany({
      where: {
        code: {
          in: SYSTEM_PLANS.map((plan) => plan.code),
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
        isSystem: true,
        isActive: true,
        maxJobs: true,
        maxMembers: true,
        maxOffices: true,
        maxPipelines: true,
      },
    });

    const existingPlanMap = new Map(
      existingPlans.map((plan) => [plan.code, plan]),
    );

    const missingPlans = SYSTEM_PLANS.filter(
      (plan) => !existingPlanMap.has(plan.code),
    );

    if (missingPlans.length > 0) {
      await tx.plan.createMany({
        data: missingPlans.map((plan) => ({
          id: plan.id,
          code: plan.code,
          name: plan.name,
          isSystem: true,
          isActive: true,
          maxJobs: plan.maxJobs,
          maxMembers: plan.maxMembers,
          maxOffices: plan.maxOffices,
          maxPipelines: plan.maxPipelines,
        })),
        skipDuplicates: true,
      });
    }

    for (const plan of SYSTEM_PLANS) {
      const existingPlan = existingPlanMap.get(plan.code);

      if (!existingPlan) {
        continue;
      }

      if (
        existingPlan.name !== plan.name ||
        !existingPlan.isSystem ||
        !existingPlan.isActive ||
        existingPlan.maxJobs !== plan.maxJobs ||
        existingPlan.maxMembers !== plan.maxMembers ||
        existingPlan.maxOffices !== plan.maxOffices ||
        existingPlan.maxPipelines !== plan.maxPipelines
      ) {
        await tx.plan.update({
          where: { id: existingPlan.id },
          data: {
            name: plan.name,
            isSystem: true,
            isActive: true,
            maxJobs: plan.maxJobs,
            maxMembers: plan.maxMembers,
            maxOffices: plan.maxOffices,
            maxPipelines: plan.maxPipelines,
          },
        });
      }
    }

    const plans = await tx.plan.findMany({
      where: {
        code: {
          in: SYSTEM_PLANS.map((plan) => plan.code),
        },
      },
      select: {
        id: true,
        code: true,
        name: true,
        maxJobs: true,
        maxMembers: true,
        maxOffices: true,
        maxPipelines: true,
      },
    });

    const planMap = Object.fromEntries(
      plans.map((plan) => [plan.code, plan]),
    ) as Partial<SystemPlanMap>;

    for (const plan of SYSTEM_PLANS) {
      if (!planMap[plan.code]) {
        throw new Error(`Failed to ensure required system plan: ${plan.code}`);
      }
    }

    return planMap as SystemPlanMap;
  });
}

export async function getSystemPlan(code: SystemPlanCode) {
  const plans = await ensureSystemPlans();
  return plans[code];
}
