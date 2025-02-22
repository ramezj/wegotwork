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

export async function GetPendingInvitations(organizationId: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if(!session?.user) { redirect('/') }
    try {
        const invitations = await prisma.organizationInvite.findMany({
            where: {
                organizationId: organizationId
            }
        })
        if(!invitations) {
            return {
                error: true,
                message: "Something went wrong"
            }
        }
        return {
            error: false,
            invitations
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: "Internal Server Error"
        }
    }
}