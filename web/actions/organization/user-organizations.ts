"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function UserOrganizations() {
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  try {
    const organizations = await prisma.user.findUnique({
      where: {
        id: session.user?.id as string,
      },
      include: {
        userOrganizations: {
          include: {
            organization: true,
          },
        },
      },
    });
    return {
      userOrganizations: organizations?.userOrganizations,
    };
  } catch (error) {
    console.error(error);
  }
}
