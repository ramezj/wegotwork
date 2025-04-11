'use server'
import prisma from "@/lib/prisma";
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
                },
                categories: {
                    create: [
                        {
                            name: "Software Development",
                            order: 1
                        },
                        {
                            name: "Finance",
                            order: 2
                        },
                        {
                            name: "Operations",
                            order: 3
                        },
                        {
                            name:"HR & Recruiting",
                            order: 4
                        },
                        {
                            name:"Security",
                            order:5
                        }
                    ]
                }
            }
        })
        const setUserOrganizationId = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                currentOrganizationId: organization.id
            }
        })
        if(!setUserOrganizationId) {
            return {
                error: true,
                message:"Couldnt set organizationId."
            }
        }
        revalidatePath('/dashboard')
        return {
            error:false,
            message:"Created Organization 🥳",
            organization: organization
        }
    } catch (error) {
        console.error(error);
    }
}