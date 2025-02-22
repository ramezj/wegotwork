"use server"
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { resend } from "@/email/config";
import { InviteUserEmail } from "@/email/invitation";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";

type OrganizationInviteWithOrganization = Prisma.OrganizationInviteGetPayload<{
    include: {
        organization: true
    }
}>

export async function CreateInvitation(organizationId: string, email: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(!session?.user) { redirect('/') }
    try {
        const InvitationExists = await prisma.organizationInvite.findFirst({
            where: {
                organizationId:organizationId,
                email
            }
        })
        if(InvitationExists) {
            return {
                error: true,
                message:"User already Invited"
            }
        }
        const user_in_organization = await prisma.organizationUser.findFirst({
            where: {
                organizationId,
                user: {
                    email
                }
            }
        })
        if(user_in_organization) {
            return {
                error: true,
                message: "User already in organization."
            }
        }
        const invitation = await prisma.organizationInvite.create({
            data: {
                organizationId:organizationId,
                email
            }
        })
        const InvitationWithOrganization = await prisma.organizationInvite.findFirst({
            where: {
                id: invitation.id
            },
            include: {
                organization: true
            }
        })
        if(invitation) {
            const sendEmail = await resend.emails.send({
                from: "noreply@heliup.xyz",
                to:email,
                subject:"You've Been Invited to an Organization",
                react: InviteUserEmail({OrganizationInvite: InvitationWithOrganization as OrganizationInviteWithOrganization})
            })
        }
        return {
            error: false,
            message:"Invited Successfully",
            invitation
        }
    } catch (error) {
        console.error(error);
    }
}