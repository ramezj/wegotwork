"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"
import { Organization } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function EditOrganization(organization: Organization) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(!session?.user) { redirect('/') }
    try {
        const organizationExists = await prisma.organization.findFirst({
            where: {
                id: organization.id
            }
        });
        if(!organizationExists) {
            return {
                error: true,
                message: "Organization not found"
            }
        }
        const checkSlug = await prisma.organization.findFirst({
            where: {
                slug:{
                    equals: organization.slug,
                    mode: "insensitive"
                }
            }
        })
        if(checkSlug && organization.slug != organizationExists.slug) {
            return {
                error: true,
                message: "Slug Already In Use"
            }
        }
        const neworganization = await prisma.organization.update({
            where: {
                id: organization.id
            },
            data: {
                name: organization.name,
                slug: organization.slug,
                description: organization.description,
                website: organization.website
            }
        })
        revalidatePath(`/${organization.id}/overview`)
        return { 
            error: false,
            message: "Updated Organization"
        }
    } catch (error) {
        console.log(error);
        return {
            error:true,
            message: error
        }
    }
}