import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";
import prisma from "@/lib/prisma";
import z from "zod";

export const getApplicantsForOrganizationFn = createServerFn()
  .inputValidator(z.object({ slug: z.string(), jobId: z.string().optional() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }

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

      const applicants = await prisma.applicant.findMany({
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
              formConfig: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return { success: true, applicants };
    } catch (error) {
      console.error("Error in getApplicantsForOrganizationFn:", error);
      throw new Error("Failed to fetch applicants");
    }
  });
