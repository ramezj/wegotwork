"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const CreateJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  id: z.string(),
});

export async function CreateJobAction(title: string, id: string) {
  const validate = CreateJobSchema.safeParse({ title, id });
  if (!validate.success) {
    return {
      error: true,
      message: validate.error.flatten().fieldErrors,
    };
  }
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  try {
    const organization = await prisma.organization.findFirst({
      where: {
        id: id,
      },
    });
    if (!organization) {
      return {
        error: true,
        message: "Workspace not found",
      };
    }
    const job = await prisma.job.create({
      data: {
        title: title,
        content: "",
        organizationId: organization.id,
      },
    });
    revalidatePath(`/${id}/jobs`);
    revalidatePath(`/${id}/applicants`);
    return {
      error: false,
      job: job,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: true,
        message: error.message,
      };
    }
    console.error(error);
    return {
      error: true,
      message: error,
    };
  }
}
