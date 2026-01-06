"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export default async function getAllOrganizationsAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return {
      error: true,
      message: "unauthenticated",
    };
  }
  const organizations = await prisma.member.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      organization: true,
    },
  });

  return {
    error: false,
    organizations,
  };
}
