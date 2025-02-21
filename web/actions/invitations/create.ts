"use server"
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
// import { resend } from "@/email/config";
// import { InviteUserEmail } from "@/email/invitation";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";

type OrganizationInviteWithOrganization = Prisma.OrganizationInviteGetPayload<{
    include: {
        organization: true
    }
}>

export async function CreateInvitation(organizationId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(!session?.user) { redirect('/') }
    try {
        const invitation = await prisma.organizationInvite.create({
            data: {
                organizationId:organizationId
            }
        })
        const InvitationWithWorkspace = await prisma.organizationInvite.findFirst({
            where: {
                id: invitation.id
            },
            include: {
                organization: true
            }
        })
        // if(invitation) {
        //     const sendEmail = await resend.emails.send({
        //         from: "noreply@heliup.xyz",
        //         to:"ramezjoseph8@gmail.com",
        //         subject:"You've Been Invited to an Organization",
        //         react: InviteUserEmail({WorkspaceInvite: InvitationWithWorkspace as WorkspaceInviteWithWorkspace})
        //     })
        //     console.log(sendEmail);
        // }
        return {
            invitation
        }
    } catch (error) {
        console.error(error);
    }
}