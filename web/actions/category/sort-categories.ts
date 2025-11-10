"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateCategoryOrder(
  organizationId: string,
  newOrder: { id: string; order: number }[],
) {
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  try {
    const update = await prisma.$transaction(
      newOrder.map((category) =>
        prisma.jobCategory.update({
          where: {
            id: category.id,
          },
          data: {
            order: category.order,
          },
        }),
      ),
    );
    revalidatePath("/categories");
    return {
      error: false,
      message: "Updated Successfully",
    };
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
}
