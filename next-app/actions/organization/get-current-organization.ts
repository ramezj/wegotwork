"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

export const getCurrentOrganizationAction = cache(async () => {
  console.log("fetching organization");
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const organization = await prisma.organization.findUnique({
    where: {
      id: session?.session.activeOrganizationId!,
    },
  });
  return organization;
});
