"use server"

import { auth } from "@/auth"
import prisma from "@/lib/db";
import { Session } from "next-auth"
import { redirect } from "next/navigation";

export async function DeleteJob(jobId: string) {
    const session: Session | null = await auth();
    if(!session) {
        return redirect('/');
    }
    const job = await prisma.job.findFirst({
        where: {
            id:jobId
        }
    });
    if(!job) {
        return { 
            ok:false,
            message: "Job does not exist"
        }
    }
    const authorizeuser = await prisma.workspaceUser.findFirst({
        where: {
            workspaceId: job.workspaceId,
            userId: session.user?.id
        }
    })
    if(!authorizeuser) {
        return { 
            ok:false,
            message: "Not Authorized"
        }
    } else {
        try {
            const deletejob = await prisma.job.delete({
                where: {
                    id: jobId
                }
            });
            redirect(`/${job.workspaceId}/jobs`)
        } catch (error) {
            return { 
                ok:false,
                message: error
            }
        }
    }
}