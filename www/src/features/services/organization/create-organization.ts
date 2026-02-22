import { createServerFn } from "@tanstack/react-start";
import { createOrganizationSchema } from "@/types/organization/schemas";
import { getSession } from "@/features/auth/server-session";
import prisma from "@/lib/prisma";

export const createOrganizationFn = createServerFn()
  .inputValidator(createOrganizationSchema)
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }
    try {
      const organization = await prisma.organization.create({
        data: {
          name: data.name,
          slug: data.slug,
          members: {
            create: {
              userId: session.user.id,
              role: "owner",
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
          jobs: {
            createMany: {
              data: [
                {
                  title: "Software Developer",
                  description: "Software Developer",
                  city: "Tallinn",
                  type: "FULLTIME",
                },
                {
                  title: "UI/UX Designer",
                  description: "UI/UX Designer",
                  city: "Cairo",
                  type: "FULLTIME",
                },
              ],
            },
          },
        },
      });
      return { success: true, organization };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
