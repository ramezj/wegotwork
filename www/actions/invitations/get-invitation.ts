"use server"
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export async function GetInvitation(invitationId: string) {
    const session:Session | null = await auth();
    try {
        const invitation = await prisma.workspaceInvite.findFirst({
            where: {
                id: invitationId,
            },
            include: {
                workspace: true
            }
        })
        return { invitation }
    } catch (error) {
        console.error(error);
    }
}