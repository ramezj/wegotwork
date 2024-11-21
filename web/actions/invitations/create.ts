"use server"
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function CreateInvitation(workspaceId: string, email:string) {
    const session = await auth();
    if(!session) { redirect('/') }
    try {
        const invitation = await prisma.workspaceInvite.create({
            data: {
                email: email,
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