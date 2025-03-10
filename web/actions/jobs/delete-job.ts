"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Session } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function DeleteJob(jobId: string) {
    const session: Session | null = await auth.api.getSession({
        headers: await headers()
    });
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
            error:true,
            message: "Job does not exist"
        }
    }
    const authorizeuser = await prisma.organizationUser.findFirst({
        where: {
            organizationId: job.organizationId,
            userId: session.user?.id
        }
    })
    if(!authorizeuser) {
        return { 
            error: true,
            message: "Not Authorized"
        }
    } else {
        try {
            const deletejob = await prisma.job.delete({
                where: {
                    id: jobId
                }
            });
            return {
                error:false,
                message: "Deleted Successfully"
            }
        } catch (error) {
            return { 
                error:true,
                message: "Internal Server Error"
            }
        }
    }
}