import { createServerFn } from "@tanstack/react-start";
import { getSession } from "../auth/server-session";
import { getOrganizationBySlugSchema } from "./schemas";
import prisma from "@/lib/prisma";

export const getOrganizationBySlugFn = createServerFn()
  .inputValidator(getOrganizationBySlugSchema)
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }
    try {
      const organization = await prisma.organization.findFirst({
        where: {
          slug: data.slug,
        },
      });
      return { success: true, organization };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
