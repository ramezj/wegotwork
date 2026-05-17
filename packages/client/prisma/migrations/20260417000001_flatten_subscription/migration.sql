-- Migrate planId from organization_subscription into organization before dropping the table
-- DropForeignKey
ALTER TABLE "organization_subscription" DROP CONSTRAINT "organization_subscription_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organization_subscription" DROP CONSTRAINT "organization_subscription_planId_fkey";

-- AlterTable: add new columns (planId temporarily nullable so we can backfill)
ALTER TABLE "organization"
  ADD COLUMN "planId" TEXT,
  ADD COLUMN "subscriptionExternalId" TEXT,
  ADD COLUMN "subscriptionPeriodEnd" TIMESTAMP(3),
  ADD COLUMN "subscriptionPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE';

-- Backfill planId from the subscription table
UPDATE "organization" o
SET "planId" = os."planId"
FROM "organization_subscription" os
WHERE os."organizationId" = o.id;

-- Default any still-null planId to the free plan (orgs with no subscription)
UPDATE "organization"
SET "planId" = 'plan_free'
WHERE "planId" IS NULL;

-- Now make planId NOT NULL
ALTER TABLE "organization" ALTER COLUMN "planId" SET NOT NULL;

-- DropTable
DROP TABLE "organization_subscription";

-- CreateIndex
CREATE INDEX "organization_planId_idx" ON "organization"("planId");

-- AddForeignKey
ALTER TABLE "organization" ADD CONSTRAINT "organization_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
