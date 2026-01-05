"use server";

import { createOrganizationSchema } from "./schemas";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidateTag } from "next/cache";

export async function createOrganizationAction(
  input: z.infer<typeof createOrganizationSchema>
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }
  const organization = await auth.api.createOrganization({
    body: {
      name: input.name,
      slug: input.slug,
      userId: session.user.id,
    },
  });
  if (!organization) {
    throw new Error("Failed to create organization");
  } else {
    const setActiveOrganization = await auth.api.setActiveOrganization({
      body: {
        organizationId: organization.id,
        organizationSlug: organization.slug,
      },
      headers: await headers(),
    });
    if (!setActiveOrganization) {
      throw new Error("Failed to set active organization");
    }
    revalidateTag("organization-" + organization.id, "max");
  }
  return organization;
}
