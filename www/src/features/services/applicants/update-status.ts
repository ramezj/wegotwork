import { createServerFn } from "@tanstack/react-start";
import { getSession } from "@/features/auth/server-session";
import prisma from "@/lib/prisma";
import { updateApplicantStatusSchema } from "@/types/applicant";

export const updateApplicantStatusFn = createServerFn()
  .inputValidator(updateApplicantStatusSchema)
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      throw new Error("Unauthenticated");
    }

    try {
      // Check if user has access to the applicant's organization
      const applicant = await prisma.applicant.findUnique({
        where: { id: data.id },
        include: {
          job: {
            select: {
              organizationId: true,
            },
          },
        },
      });

      if (!applicant) {
        throw new Error("Applicant not found");
      }

      const membership = await prisma.member.findFirst({
        where: {
          organizationId: applicant.job.organizationId,
          userId: session.user.id,
        },
      });

      if (!membership) {
        throw new Error("Access denied");
      }

      const updatedApplicant = await prisma.applicant.update({
        where: { id: data.id },
        data: {
          status: data.status,
        },
      });

      return { success: true, applicant: updatedApplicant };
    } catch (error) {
      console.error("Error in updateApplicantStatusFn:", error);
      throw new Error("Failed to update applicant status");
    }
  });
