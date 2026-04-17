CREATE TABLE "plan" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "plan_code_key" ON "plan"("code");

INSERT INTO "plan" ("id", "code", "name", "isSystem", "isActive", "createdAt", "updatedAt")
VALUES
    ('plan_free', 'free', 'Free', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('plan_premium', 'premium', 'Premium', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('plan_enterprise', 'enterprise', 'Enterprise', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

ALTER TABLE "organization" ADD COLUMN "planId" TEXT;

UPDATE "organization"
SET "planId" = CASE
    WHEN "plan" = 'PREMIUM' THEN 'plan_premium'
    ELSE 'plan_free'
END
WHERE "planId" IS NULL;

ALTER TABLE "organization" ALTER COLUMN "planId" SET NOT NULL;

CREATE INDEX "organization_planId_idx" ON "organization"("planId");

ALTER TABLE "organization"
ADD CONSTRAINT "organization_planId_fkey"
FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "organization"
DROP COLUMN IF EXISTS "billingCustomerId",
DROP COLUMN IF EXISTS "billingSubscriptionId",
DROP COLUMN IF EXISTS "subscriptionStatus",
DROP COLUMN IF EXISTS "plan";

DROP TYPE IF EXISTS "OrganizationSubscriptionStatus";
DROP TYPE IF EXISTS "OrganizationPlan";
