import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";

export const getOrganizationCategoriesFn = createServerFn()
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }
    try {
      const categories = await prisma.jobCategory.findMany({
        where: {
          organization: {
            slug: data.slug,
          },
        },
        orderBy: {
          order: "asc",
        },
      });
      return { success: true, categories };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
