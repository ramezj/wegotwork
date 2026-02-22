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
              { name: "Software Development", order: 1 },
              { name: "Finance", order: 2 },
              { name: "Operations", order: 3 },
              { name: "HR & Recruiting", order: 4 },
              { name: "Security", order: 5 },
              { name: "Marketing", order: 6 },
              { name: "Sales", order: 7 },
              { name: "Customer Success", order: 8 },
              { name: "Product Management", order: 9 },
              { name: "Data & Analytics", order: 10 },
              { name: "Legal & Compliance", order: 11 },
              { name: "Design & Creative", order: 12 },
              { name: "Quality Assurance", order: 13 },
              { name: "IT Support", order: 14 },
              { name: "Public Relations", order: 15 },
              { name: "Administration", order: 16 },
              { name: "Logistics & Supply Chain", order: 17 },
              { name: "Research & Development", order: 18 },
              { name: "Customer Support", order: 19 },
              { name: "Project Management", order: 20 },
              { name: "Health & Safety", order: 21 },
              { name: "Facilities & Real Estate", order: 22 },
              { name: "Strategy", order: 23 },
              { name: "Engineering", order: 24 },
              { name: "Manufacturing", order: 25 },
              { name: "Purchasing & Procurement", order: 26 },
              { name: "Risk Management", order: 27 },
              { name: "Training & Development", order: 28 },
              { name: "Executive Leadership", order: 29 },
              { name: "Content & Copywriting", order: 30 },
              { name: "Social Media", order: 31 },
              { name: "Advertising", order: 32 },
              { name: "Business Development", order: 33 },
              { name: "Event Planning", order: 34 },
              { name: "Sustainability & ESG", order: 35 },
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
