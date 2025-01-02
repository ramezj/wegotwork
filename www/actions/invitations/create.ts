"use server"
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function CreateInvitation(workspaceId: string) {
    const session = await auth();
    if(!session) { redirect('/') }
    try {
        const invitation = await prisma.workspaceInvite.create({
            data: {
                workspaceId:workspaceId
            }
        })
        return {
            invitation
        }
    } catch (error) {
        console.error(error);
    }
}