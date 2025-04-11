
"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function DeleteOrganization(organizationId: string) {
    const session: Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) { redirect('/') }
    try {
        const deleteOrganization = await prisma.organization.delete({
            where: {
                id: organizationId
            }
        })
        if(!deleteOrganization) {
            return {
                error: true,
                message:"Organization Not Found"
            }
        }
        return {
            error:false,
            message:"deleted successfully"
        }
    } catch (error: unknown) {
        console.error(error);
        if(error instanceof Error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
}