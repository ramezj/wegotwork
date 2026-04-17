import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const SYSTEM_PLANS = [
  { id: "plan_free", code: "free", name: "Free" },
  { id: "plan_premium", code: "premium", name: "Premium" },
  { id: "plan_enterprise", code: "enterprise", name: "Enterprise" },
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
      },
      create: {
        id: plan.id,
        code: plan.code,
        name: plan.name,
        isSystem: true,
        isActive: true,
      },
    });
    console.log(`  ✓ Plan upserted: ${plan.name} (${plan.code})`);
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
