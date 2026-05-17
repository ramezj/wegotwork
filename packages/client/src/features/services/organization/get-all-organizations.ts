import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";

export const getAllOrganizationsFn = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const organizations = await prisma.organization.findMany({
        where: {
          members: {
            some: {
              userId: context.session.user.id,
            },
          },
        },
        include: {
          plan: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { success: true, organizations };
    } catch (error) {
      throw new Error("Something Went Wrong");
    }
  });
