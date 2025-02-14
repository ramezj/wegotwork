"use server"

import { auth } from "@/auth"
import { Session } from "next-auth"
import prisma from "@/lib/db";

export async function RevokeAccess(workspaceId: string, userIdToRevoke: string) {
    const session:Session | null = await auth();
    if(!session) { 
        return {
            error:true,
            message:"Unauthorized"
        }
    }
    const currentUserRole = await prisma.workspaceUser.findFirst({
        where: {
            userId: session.user?.id,
            workspaceId
        }
    })
}