import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import { updateCandidateStatusSchema } from "@/types/candidate";

export const updateCandidateStatusFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(updateCandidateStatusSchema)
  .handler(async ({ data, context }) => {
    const { session } = context;

    try {
      // Check if user has access to the candidate's organization
      const candidate = await prisma.candidate.findUnique({
        where: { id: data.id },
        include: {
          job: {
            select: {
              organizationId: true,
            },
          },
        },
      });

      if (!candidate) {
        throw new Error("Candidate not found");
      }

      const membership = await prisma.member.findFirst({
        where: {
          organizationId: candidate.job.organizationId,
          userId: session.user.id,
        },
      });

      if (!membership) {
        throw new Error("Access denied");
      }

      const updatedCandidate = await prisma.candidate.update({
        where: { id: data.id },
        data: {
          status: data.status,
        },
      });

      return { success: true, candidate: updatedCandidate };
    } catch (error) {
      console.error("Error in updateCandidateStatusFn:", error);
      throw new Error("Failed to update candidate status");
    }
  });
