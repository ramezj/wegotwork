"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Job } from "@prisma/client";
import { Session } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function EditJob(job: Job, categoryId: string | null) {
    if(categoryId === "none") {
        categoryId = null;
    }
    console.log(job);
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
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
        const checkuser = await prisma.organizationUser.findFirst({
            where: {
                userId: session.user?.id,
                organizationId: job.organizationId
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
                content: job.content,
                country: job.country === "" ? null : job.country,
                city: job.city === "" ? null : job.city,
                categoryId: categoryId ?? null
            }
        })
        return { 
            ok:true,
            message: "Job Updated Successfully!"
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message: error
        };
    }
}