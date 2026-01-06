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
    return {
      error: true,
      message: "Unauthorized",
    };
  }
  const organization = await auth.api.createOrganization({
    body: {
      name: input.name,
      slug: input.slug,
      userId: session.user.id,
    },
  });
  if (!organization) {
    return {
      error: true,
      message: "Failed to create organization",
    };
  } else {
    const setActiveOrganization = await auth.api.setActiveOrganization({
      body: {
        organizationId: organization.id,
        organizationSlug: organization.slug,
      },
      headers: await headers(),
    });
    if (!setActiveOrganization) {
      return {
        error: true,
        message: "Failed to set active organization",
      };
    }
  }
  return {
    organization,
  };
}
