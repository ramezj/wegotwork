import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../auth/server-session";
import { getOrganizationBySlugSchema } from "./schemas";
import prisma from "@/lib/prisma";

export const getOrganizationBySlugFn = createServerFn()
  .inputValidator(getOrganizationBySlugSchema)
  .handler(async ({ data }) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }
    try {
      const organization = await prisma.organization.findFirst({
        where: {
          slug: data.slug,
        },
        include: {
          jobs: true,
          categories: true,
        },
      });
      return { success: true, organization };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
