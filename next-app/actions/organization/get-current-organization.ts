"use server";

import prisma from "@/lib/prisma";
import { cache } from "react";

export const getCurrentOrganizationAction = cache(
  async (organizationId: string) => {
    console.log("fetching organization");
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });
    return organization;
  }
);
