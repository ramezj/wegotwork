import prisma from "@/lib/prisma";

const SYSTEM_PLANS = [
  { id: "plan_free", code: "free", name: "Free" },
  { id: "plan_premium", code: "premium", name: "Premium" },
  { id: "plan_enterprise", code: "enterprise", name: "Enterprise" },
] as const;

export type SystemPlanCode = (typeof SYSTEM_PLANS)[number]["code"];

type SystemPlanMap = Record<SystemPlanCode, { id: string; code: string; name: string }>;

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
        !existingPlan.isActive
      ) {
        await tx.plan.update({
          where: { id: existingPlan.id },
          data: {
            name: plan.name,
            isSystem: true,
            isActive: true,
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
