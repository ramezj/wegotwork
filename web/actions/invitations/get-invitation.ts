"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { resend } from "@/email/config";
import { InviteUserEmail } from "@/email/invitation";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function GetInvitation(invitationId: string) {
    // const session = await auth.api.getSession({
    //     headers: await headers()
    // });
    // if(!session?.user) { redirect('/') }
    try {
        const invitation = await prisma.organizationInvite.findFirst({
            where: {
                id: invitationId,
            },
            include: {
                organization: true
            }
        })
        if(!invitation) {
            return {
                error:true,
                message:"Invitation Expired or doesn't exist"
            }
        }
        // const userAlreadyMember = await prisma.organizationUser.findFirst({
        //     where: {
        //         userId: session?.user?.id,
        //         organizationId: invitation.organizationId
        //     }
        // })
        // if(userAlreadyMember) {
        //     return {
        //         error: true,
        //         message:"You are already a member of this organization."
        //     }
        // }
        return { 
            error:false,
            invitation: invitation
         }
    } catch (error) {
        console.error(error);
    }
}