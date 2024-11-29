"use server"
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function AcceptInvitation(invitationId: string, workspaceId: string) {
    const session = await auth();
    if(!session) { redirect('/') }
    try {
        const invitation = await prisma.workspaceInvite.findFirst({
            where: {
                id: invitationId,
            }
        })
    } catch (error) {
        console.error(error);
    }
}