"use server"
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Job } from "@prisma/client";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export async function EditJob(job: Job) {
    const session:Session | null = await auth();
    if(!session) { redirect('/') }
    try {
        const thejob = await prisma.job.findFirst({
            where: {
                id: job?.id
            }
        });
        if(!thejob) {
            return { 
                error: true,
                message: "Job doesnt exist"
            }
        }
        // check if logged in user's id = the id in workspace of job.
        const checkuser = await prisma.workspaceUser.findFirst({
            where: {
                userId: session.user?.id,
                workspaceId: job.workspaceId
            }
        })
        if(!checkuser) {
            return { 
                ok:false,
                message: "Only administrator can perform this action."
            }
        }
        const newjob = await prisma.job.update({
            where: {
                id: job.id
            },
            data: {
                type: job.type,
                title: job.title,
                content: job.content
            }
        })
        return { 
            ok:true,
            message: "Updated Job"
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: error
        };
    }
}