import { createServerFn } from "@tanstack/react-start";
import { getServerSession } from "@/lib/get-server-session";
import prisma from "@/lib/prisma";

export const getActiveOrganizationFn = createServerFn().handler(async () => {
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
    return { organization };
  } catch (error) {
    return {
      error: "Failed to fetch organizations",
    };
  }
});
