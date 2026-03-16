import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import { getOrganizationTeamSchema } from "@/types/organization/schemas";
import prisma from "@/lib/prisma";

export const getOrganizationTeamFn = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(getOrganizationTeamSchema)
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
            orderBy: {
              createdAt: "asc",
            },
          },
          invitations: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!organization) {
        return {
          success: false,
          organization: null,
          members: [],
          invitations: [],
          currentMemberRole: null,
          error: "Organization not found",
        };
      }

      const currentMember = organization.members.find(
        (member) => member.userId === session.user.id,
      );

      return {
        success: true,
        organization,
        members: organization.members,
        invitations: organization.invitations,
        currentMemberRole: currentMember?.role || null,
      };
    } catch (error) {
      console.error("Error in getOrganizationTeamFn:", error);
      return {
        success: false,
        organization: null,
        members: [],
        invitations: [],
        currentMemberRole: null,
        error: "Something went wrong",
      };
    }
  });
