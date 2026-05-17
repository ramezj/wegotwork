import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import { inviteOrganizationMemberSchema } from "@/types/organization/schemas";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { Role } from "generated/prisma/client";

const INVITE_EXPIRY_DAYS = 7;

export const inviteOrganizationMemberFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(inviteOrganizationMemberSchema)
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
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!organization) {
        return { success: false, error: "Organization not found" };
      }

      const currentMember = organization.members.find(
        (member) => member.userId === session.user.id,
      );
      const canInvite =
        currentMember &&
        (currentMember.role === Role.owner || currentMember.role === Role.admin);
      if (!canInvite) {
        return {
          success: false,
          error: "You do not have permission to invite members.",
        };
      }

      const normalizedEmail = data.email.trim().toLowerCase();
      const existingMember = organization.members.find(
        (member) => member.user.email.toLowerCase() === normalizedEmail,
      );
      if (existingMember) {
        return {
          success: false,
          error: "User already belongs to this organization.",
        };
      }

      const existingInvite = await prisma.invitation.findFirst({
        where: {
          organizationId: organization.id,
          email: normalizedEmail,
          status: "pending",
        },
      });
      if (existingInvite) {
        return { success: false, error: "Invitation already sent." };
      }

      const expiresAt = new Date(
        Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      );
      const invitation = await prisma.invitation.create({
        data: {
          id: randomUUID(),
          organizationId: organization.id,
          email: normalizedEmail,
          role: data.role || Role.member,
          status: "pending",
          expiresAt,
          inviterId: session.user.id,
        },
      });

      return { success: true, invitation };
    } catch (error) {
      console.error("Error in inviteOrganizationMemberFn:", error);
      return { success: false, error: "Something went wrong" };
    }
  });
