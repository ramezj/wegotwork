'use server'
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function CreateOrganization(name: string, slug: string) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) { redirect('/') }
    try {
        const organizationExist = await prisma.organization.findFirst({
            where: {
                slug
            }
        })
        if(organizationExist) {
            return { 
                error:true,
                message:"Slug in-use, please use another slug"
            }
        }
        const organization = await prisma.organization.create({
            data: {
                name: name,
                slug:slug,
                users: {
                    create: {
                        userId: session.user?.id as string,
                        role: 'owner'
                    }
                }
            }
        })
        revalidatePath('/dashboard')
        return {
            organization: organization
        }
    } catch (error) {
        console.error(error);
    }
}