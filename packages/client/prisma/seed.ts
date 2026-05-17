import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import plansData from "../src/data/plans.json";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const SYSTEM_PLANS = plansData.plans.map((plan) => ({
  id: plan.id,
  code: plan.code,
  name: plan.name,
  maxJobs: plan.quotas.maxJobs,
  maxMembers: plan.quotas.maxMembers,
  maxOffices: plan.quotas.maxOffices,
  maxPipelines: plan.quotas.maxPipelines,
}));

async function main() {
  console.log("🌱 Running seed...");

  for (const plan of SYSTEM_PLANS) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: {
        name: plan.name,
        isSystem: true,
        isActive: true,
        maxJobs: plan.maxJobs,
        maxMembers: plan.maxMembers,
        maxOffices: plan.maxOffices,
        maxPipelines: plan.maxPipelines,
      },
      create: {
        id: plan.id,
        code: plan.code,
        name: plan.name,
        isSystem: true,
        isActive: true,
        maxJobs: plan.maxJobs,
        maxMembers: plan.maxMembers,
        maxOffices: plan.maxOffices,
        maxPipelines: plan.maxPipelines,
      },
    });
    console.log(
      `  ✓ Plan upserted: ${plan.name} (jobs: ${plan.maxJobs === -1 ? "∞" : plan.maxJobs}, members: ${plan.maxMembers === -1 ? "∞" : plan.maxMembers})`,
    );
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
