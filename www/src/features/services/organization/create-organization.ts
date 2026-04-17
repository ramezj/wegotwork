import { createServerFn } from "@tanstack/react-start";
import { createOrganizationSchema } from "@/types/organization/schemas";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import { Role } from "generated/prisma/client";
import { getSystemPlan } from "./plans";

export const createOrganizationFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(createOrganizationSchema)
  .handler(async ({ data, context }) => {
    const { session } = context;
    try {
      const freePlan = await getSystemPlan("free");

      const existingOrg = await prisma.organization.findUnique({
        where: { slug: data.slug },
      });
      if (existingOrg) {
        return { success: false, error: "Slug is already in use" };
      }

      const organization = await prisma.$transaction(async (tx) => {
        const createdOrganization = await tx.organization.create({
          data: {
            name: data.name,
            slug: data.slug,
            planId: freePlan.id,
            members: {
              create: {
                userId: session.user.id,
                role: Role.owner,
              },
            },
            categories: {
              create: [
                { name: "Software Development" },
                { name: "Finance" },
                { name: "Operations" },
                { name: "HR & Recruiting" },
                { name: "Security" },
                { name: "Marketing" },
                { name: "Sales" },
                { name: "Customer Success" },
                { name: "Product Management" },
                { name: "Data & Analytics" },
                { name: "Legal & Compliance" },
                { name: "Design & Creative" },
                { name: "Quality Assurance" },
                { name: "IT Support" },
                { name: "Public Relations" },
                { name: "Administration" },
                { name: "Logistics & Supply Chain" },
                { name: "Research & Development" },
                { name: "Customer Support" },
                { name: "Project Management" },
                { name: "Health & Safety" },
                { name: "Facilities & Real Estate" },
                { name: "Strategy" },
                { name: "Engineering" },
                { name: "Manufacturing" },
                { name: "Purchasing & Procurement" },
                { name: "Risk Management" },
                { name: "Training & Development" },
                { name: "Executive Leadership" },
                { name: "Content & Copywriting" },
                { name: "Social Media" },
                { name: "Advertising" },
                { name: "Business Development" },
                { name: "Event Planning" },
                { name: "Sustainability & ESG" },
              ],
            },
          },
        });

        const defaultPipeline = await tx.pipeline.create({
          data: {
            name: "Standard Pipeline",
            organizationId: createdOrganization.id,
            stages: {
              create: [
                { name: "Screening", order: 0 },
                { name: "Interview", order: 1 },
                { name: "Technical Task", order: 2 },
                { name: "Final Interview", order: 3 },
                { name: "Offer", order: 4 },
              ],
            },
          },
        });

        return tx.organization.update({
          where: { id: createdOrganization.id },
          data: {
            defaultPipelineId: defaultPipeline.id,
          },
        });
      });
      return { success: true, organization };
    } catch (error) {
      console.error(error);
      throw new Error("Something Went Wrong");
    }
  });
