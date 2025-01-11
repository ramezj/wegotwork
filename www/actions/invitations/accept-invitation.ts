"use server"
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function AcceptInvitation(invitationId: string) {
    const session = await auth();
    if(!session) { redirect('/') }
    try {
        const invitation = await prisma.workspaceInvite.findFirst({
            where: {
                id: invitationId,
            }
        })
        // if(invitation?.email !== session.user?.email) {
        //     return redirect('/');
        // }
        const accept_invitation = await prisma.workspaceUser.create({
            data: {
                workspaceId: invitation?.workspaceId as string,
                userId: session.user?.id as string,
                role: invitation?.role as Role
            }
        })
        const delete_invitation = await prisma.workspaceInvite.delete({
            where: {
                id: invitationId
            }
        })
        return {
            success: true
        }
    } catch (error) {
        console.error(error);
    }
}