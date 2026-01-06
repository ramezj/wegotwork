"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export default async function setCurrentOrganizationAction(
  organizationId: string,
  organizationSlug: string
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  await auth.api.setActiveOrganization({
    body: {
      organizationId,
      organizationSlug,
    },
    headers: await headers(),
  });
  return {
    error: false,
    message: "Organization set successfully",
  };
}
