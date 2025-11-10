"use server";
import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function SetCurrentOrganization(organizationId: string) {
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return {
      error: true,
      message: "user not logged in.",
    };
  }
  try {
    const isMember = await prisma.organizationUser.findFirst({
      where: {
        userId: session?.user.id,
        organizationId: organizationId,
      },
    });
    if (!isMember) {
      return {
        error: true,
        message: "user not member of organization",
      };
    }
    const setCurrentOrganization = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        currentOrganizationId: organizationId,
      },
    });
    revalidatePath("/overview");
    return {
      error: false,
      message: "Updated Organization Successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      return {
        error: true,
        message: error.message,
      };
    }
  }
}
