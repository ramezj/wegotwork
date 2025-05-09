
"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function GetOrganization(organizationId: string) {
    const session: Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) { redirect('/') }
    try {
        const organization = await prisma.organizationUser.findFirst({
            where: {
                userId: session.user?.id,
                organizationId: organizationId
            },
            include: {
                organization: {
                    include: {
                        categories: true,
                        invitations: true,
                        users: {
                            include: {
                                user: true
                            }
                        },
                        jobs:true,
                    }
                }
            }
        })
        if(!organization) {
            return {
                error: true,
                message:"Organization Not Found"
            }
        }
        const applicantCount = await prisma.applicant.count({
            where: {
                job: {
                    organizationId:organizationId
                }
            }
        });
        return {
            error:false,
            organization,
            applicants: applicantCount
        }
    } catch (error) {
        console.error(error);
    }
}