"use server"

import { auth } from "@/auth"
import { Session } from "next-auth"
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

export async function AuthorizeUserToEditJob(jobId: string) {
    const session:Session | null = await auth();
    if(!session) redirect('/');
    const job = await prisma.job.findFirst({
        where: {
            id: jobId
        }
    })
    if(!job) return redirect('/');
    const workspaceuser = await prisma.workspaceUser.findFirst({
        where: {
            userId: session.user?.id,
            workspaceId: job.workspaceId
        }
    })
    if(!workspaceuser) {
        return redirect('/');
    }
}