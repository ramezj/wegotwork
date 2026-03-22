import { createServerFn } from "@tanstack/react-start";
import prisma from "@/lib/prisma";
import z from "zod";

export const getInvitationByIdFn = createServerFn()
  .inputValidator(
    z.object({
      invitationId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const invitation = await prisma.invitation.findUnique({
        where: {
          id: data.invitationId,
        },
        include: {
          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!invitation) {
        return {
          success: false,
          invitation: null,
          error: "Invitation not found.",
        };
      }

      const isExpired = invitation.expiresAt.getTime() < Date.now();

      return {
        success: true,
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role || "member",
          status: invitation.status,
          expiresAt: invitation.expiresAt,
          isExpired,
          organization: invitation.organization,
          inviter: invitation.user,
        },
      };
    } catch (error) {
      console.error("Error in getInvitationByIdFn:", error);
      return {
        success: false,
        invitation: null,
        error: "Something went wrong.",
      };
    }
  });
