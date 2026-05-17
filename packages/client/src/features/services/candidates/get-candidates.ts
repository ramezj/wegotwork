import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";

export const getCandidatesForOrganizationFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(z.object({ slug: z.string(), jobId: z.string().optional() }))
  .handler(async ({ data, context }) => {
    const { session } = context;

    try {
      const organization = await prisma.organization.findFirst({
        where: {
          slug: data.slug,
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      });

      if (!organization) {
        throw new Error("Organization not found or access denied");
      }

      const candidates = await prisma.candidate.findMany({
        where: {
          job: {
            organizationId: organization.id,
          },
          ...(data.jobId ? { jobId: data.jobId } : {}),
        },
        include: {
          job: {
            select: {
              title: true,
              id: true,
              questions: true,
            },
          },
          responses: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { success: true, candidates };
    } catch (error) {
      console.error("Error in getCandidatesForOrganizationFn:", error);
      throw new Error("Failed to fetch candidates");
    }
  });
