import { createServerFn } from "@tanstack/react-start";
import { getServerSession } from "@/lib/get-server-session";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

export const setActiveOrganizationFn = createServerFn()
  .inputValidator(
    z.object({
      organizationId: z.string(),
      organizationSlug: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const session = await getServerSession();
    if (!session?.user) {
      console.log("No user");
      return {
        error: "Unauthorized",
      };
    }
    try {
      const organization = await prisma.organization.findFirst({
        where: {
          id: data.organizationId,
        },
      });
      if (!organization) {
        return {
          error: "Organization not found",
        };
      }
      await auth.api.setActiveOrganization({
        body: {
          organizationId: data.organizationId,
          organizationSlug: data.organizationSlug,
        },
        headers: await getRequest().headers,
      });
      console.log("set successfully");
      return {
        success: true,
      };
    } catch (error) {
      return {
        error: "Failed to fetch dash",
      };
    }
  });
