"use server"
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { Session } from "next-auth"
import { redirect } from "next/navigation";

export async function DeleteWorkspace(workspaceId: string) {
    const session:Session | null = await auth();
    if(!session) { redirect('/') }
    try {
        const check_permission = await prisma.workspaceUser.findFirst({
            where: {
                userId: session.user?.id,
                workspaceId: workspaceId
            }
        })
        if(!check_permission) { return null }
        if(check_permission.role === "owner") {
            const delete_workspace = await prisma.workspace.delete({
                where: {
                    id:workspaceId
                }
            });
            return { 
                success: true
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
    }
}