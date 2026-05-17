import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import { Role } from "generated/prisma/client";
import z from "zod";

export const acceptOrganizationInvitationFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      invitationId: z.string(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { session } = context;

    try {
      const invitation = await prisma.invitation.findUnique({
        where: {
          id: data.invitationId,
        },
        include: {
          organization: {
            select: {
              id: true,
              slug: true,
            },
          },
        },
      });

      if (!invitation) {
        return { success: false, error: "Invitation not found." };
      }

      if (invitation.status !== "pending") {
        return { success: false, error: "This invitation is no longer active." };
      }

      if (invitation.expiresAt.getTime() < Date.now()) {
        return { success: false, error: "This invitation has expired." };
      }

      if (session.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
        return {
          success: false,
          error: "Please sign in with the invited email address to accept this invitation.",
        };
      }

      const existingMember = await prisma.member.findFirst({
        where: {
          organizationId: invitation.organizationId,
          userId: session.user.id,
        },
      });

      if (existingMember) {
        await prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: "accepted" },
        });

        return {
          success: true,
          organizationSlug: invitation.organization.slug,
        };
      }

      await prisma.$transaction([
        prisma.member.create({
          data: {
            organizationId: invitation.organizationId,
            userId: session.user.id,
            role: (invitation.role || Role.member) as Role,
          },
        }),
        prisma.invitation.update({
          where: { id: invitation.id },
          data: { status: "accepted" },
        }),
      ]);

      return {
        success: true,
        organizationSlug: invitation.organization.slug,
      };
    } catch (error) {
      console.error("Error in acceptOrganizationInvitationFn:", error);
      return { success: false, error: "Something went wrong." };
    }
  });
