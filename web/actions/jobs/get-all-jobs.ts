"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function GetOrganizationJobs(organizationId: string) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { redirect('/') }
    try {
        const jobs = await prisma.organization.findFirst({
            where: {
                id: organizationId
            },
            select: {
                jobs: true
            }
            
        })
        if(!jobs) {
            return {
                error: true,
                message:"Organization Not Found"
            }
        }
        return {
            error: false,
            jobs: jobs
         }
    } catch (error) {
        console.error(error);
    }
}