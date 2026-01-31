import { createServerFn } from "@tanstack/react-start";
import { createOrganizationSchema } from "@/features/types/organization/schemas";
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
              {
                name: "Software Development",
                order: 1,
              },
              {
                name: "Finance",
                order: 2,
              },
              {
                name: "Operations",
                order: 3,
              },
              {
                name: "HR & Recruiting",
                order: 4,
              },
              {
                name: "Security",
                order: 5,
              },
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
