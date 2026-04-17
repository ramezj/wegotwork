import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const SYSTEM_PLANS = [
  {
    id: "plan_free",
    code: "free",
    name: "Free",
    maxJobs: 3,
    maxMembers: 3,
    maxOffices: 1,
    maxPipelines: 1,
  },
  {
    id: "plan_premium",
    code: "premium",
    name: "Premium",
    maxJobs: 25,
    maxMembers: 10,
    maxOffices: 5,
    maxPipelines: 5,
  },
  {
    id: "plan_enterprise",
    code: "enterprise",
    name: "Enterprise",
    maxJobs: -1,      // unlimited
    maxMembers: -1,   // unlimited
    maxOffices: -1,   // unlimited
    maxPipelines: -1, // unlimited
  },
] as const;

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
    console.log(`  ✓ Plan upserted: ${plan.name} (jobs: ${plan.maxJobs === -1 ? "∞" : plan.maxJobs}, members: ${plan.maxMembers === -1 ? "∞" : plan.maxMembers})`);
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
