"use server"
import { auth } from "@/lib/auth"
import { Session } from "@/lib/auth-client"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

export async function SetCurrentOrganization(organizationId: string) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        return {
            error: true,
            message:"user not logged in."
        }
    }
    try {
        const isMember = await prisma.organizationUser.findFirst({
            where: {
                userId: session?.user.id,
                organizationId: organizationId
            }
        })
        if(!isMember) {
            console.log(isMember);
            return {
                error: true,
                message:"user not member of organization"
            }
        }
        const setCurrentOrganization = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                currentOrganizationId:organizationId
            }
        })
        console.log(setCurrentOrganization);
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.log(error.message)
            return {
                error: true,
                message: error.message
            }
        }
    }
}