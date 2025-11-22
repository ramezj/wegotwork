"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Organization } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import z from "zod";
import { organizationSettings } from "@/schemas/organization-settings";

export async function EditOrganization(
  organization: Organization,
  settings: z.infer<typeof organizationSettings>
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/");
  }
  try {
    const organizationExists = await prisma.organization.findFirst({
      where: {
        id: organization.id,
      },
    });
    if (!organizationExists) {
      return {
        error: true,
        message: "Organization not found",
      };
    }
    const checkSlug = await prisma.organization.findFirst({
      where: {
        slug: {
          equals: settings.slug,
          mode: "insensitive",
        },
      },
    });
    if (checkSlug && settings.slug !== organizationExists.slug) {
      return {
        error: true,
        message: "Slug Already In Use",
      };
    }
    const neworganization = await prisma.organization.update({
      where: {
        id: organization.id,
      },
      data: {
        name: settings.name,
        slug: settings.slug,
        description: settings.description,
        website: settings.website,
      },
    });
    revalidatePath(`/${organization.id}/overview`);
    return {
      error: false,
      message: "Successfully Updated Organization!",
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      message: error,
    };
  }
}
