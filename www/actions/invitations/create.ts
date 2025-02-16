"use server"
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { resend } from "@/email/config";
import { InviteUserEmail } from "@/email/invitation";
import { Prisma } from "@prisma/client";

type WorkspaceInviteWithWorkspace = Prisma.WorkspaceInviteGetPayload<{
    include: {
        workspace: true
    }
}>

export async function CreateInvitation(workspaceId: string) {
    const session = await auth();
    if(!session) { redirect('/') }
    try {
        const invitation = await prisma.workspaceInvite.create({
            data: {
                workspaceId:workspaceId
            }
        })
        const InvitationWithWorkspace = await prisma.workspaceInvite.findFirst({
            where: {
                id: invitation.id
            },
            include: {
                workspace: true
            }
        })
        if(invitation) {
            const sendEmail = await resend.emails.send({
                from: "noreply@heliup.xyz",
                to:"ramezjoseph8@gmail.com",
                subject:"You've Been Invited to an Organization",
                react: InviteUserEmail({WorkspaceInvite: InvitationWithWorkspace as WorkspaceInviteWithWorkspace})
            })
            console.log(sendEmail);
        }
        return {
            invitation
        }
    } catch (error) {
        console.error(error);
    }
}