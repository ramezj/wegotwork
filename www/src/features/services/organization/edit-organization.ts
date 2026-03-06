import { createServerFn } from "@tanstack/react-start";
import { editOrganizationSchema } from "@/types/organization/schemas";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";

export const editOrganizationFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ id: z.string(), data: editOrganizationSchema }))
  .handler(async ({ data, context }) => {
    const { session } = context;

    // Authorization check: User must be an owner or admin of the organization
    const member = await prisma.member.findFirst({
      where: {
        organizationId: data.id,
        userId: session.user.id,
        role: {
          in: ["owner", "admin"],
        },
      },
    });

    if (!member) {
      throw new Error("You are not authorized to edit this organization");
    }

    try {
      const organization = await prisma.organization.update({
        where: { id: data.id },
        data: {
          name: data.data.name,
          slug: data.data.slug,
          logo: data.data.logo || null,
          description: data.data.description,
          website: data.data.website,
        },
      });
      return { success: true, organization };
    } catch (error) {
      console.error("Update error:", error);
      throw new Error("Failed to update organization");
    }
  });
