import { createServerFn } from "@tanstack/react-start";
import { getServerSession } from "@/lib/get-server-session";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getRequest } from "@tanstack/react-start/server";
import { dashSchema } from "./schemas";

export const getDashFn = createServerFn()
  .inputValidator(dashSchema)
  .handler(async () => {
    const session = await getServerSession();
    if (!session.user) {
      return {
        error: "Unauthorized",
      };
    }
    if (!session.session.activeOrganizationId) {
      return {
        error: "No active organization",
      };
    }
    try {
      const organization = await prisma.organization.findFirst({
        where: {
          id: session.session.activeOrganizationId,
        },
      });
      const organizations = await auth.api.listOrganizations({
        headers: await getRequest().headers,
      });
      return { organization, organizations };
    } catch (error) {
      return {
        error: "Failed to fetch dash",
      };
    }
  });
