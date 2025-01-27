import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export async function EditJob(jobId: string) {
    const session: Session | null = await auth();
    if(!session) {
        return redirect('/');
    }
    try {
        const job = await prisma.job.findFirst({
            where: {
                id: jobId
            }
        });
        if(!job) {
            return { 
                error: true,
                message: "Job doesnt exist"
            }
        }
        const checkuser = await prisma.workspaceUser.findFirst({
            where: {
                id: session.user?.id,
                workspaceId: job.workspaceId
            }
        })
        if(!checkuser) {
            return redirect('/');
        }
        return {
            error: false,
            job:job
        };
    } catch (error) {
        return {
            error: true,
            message: error
        };
    }
}