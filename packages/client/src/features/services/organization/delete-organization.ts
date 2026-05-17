import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/features/auth/middleware";
import prisma from "@/lib/prisma";
import z from "zod";
import { Role } from "generated/prisma/client";

export const deleteOrganizationFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const { session } = context;

    // Authorization check: User must be an owner of the organization to delete it
    const member = await prisma.member.findFirst({
      where: {
        organizationId: data.id,
        userId: session.user.id,
        role: Role.owner,
      },
    });

    if (!member) {
      throw new Error("You are not authorized to delete this organization. Only owners can do this.");
    }

    try {
      await prisma.organization.delete({
        where: { id: data.id },
      });
      return { success: true };
    } catch (error) {
      console.error("Delete error:", error);
      throw new Error("Failed to delete organization");
    }
  });
