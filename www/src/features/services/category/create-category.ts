import { createServerFn } from "@tanstack/react-start";
import { categorySchema } from "@/types/job/job";
import { getSession } from "@/features/auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";

export const createCategoryFn = createServerFn()
  .inputValidator(z.object({ slug: z.string(), category: categorySchema }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }

    const organization = await prisma.organization.findUnique({
      where: { slug: data.slug },
      include: {
        members: {
          where: { userId: session.user.id },
        },
      },
    });

    if (!organization || organization.members.length === 0) {
      throw new Error("Unauthorized or organization not found");
    }

    try {
      const category = await prisma.jobCategory.create({
        data: {
          name: data.category.name,
          organizationId: organization.id,
        },
      });
      return { success: true, category };
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  });
