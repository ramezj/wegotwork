"use server"

import { auth } from "@/lib/auth"
import { Session } from "@/lib/auth-client"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function GetJobApplicants(jobId: string) {
    const session: Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        redirect('/')
    };
    try {
        const job = await prisma.job.findFirst({
            where: {
                id: jobId
            },
            include: {
                applicants: true
            }
        });
        if(!job) {
            return {
                error: true,
                message: "Job Not Found"
            }
        }
        return {
            applicants: job.applicants
        }
    } catch (error) {
        console.log("something went wrong");
        return {
            error: true,
            message:"Internal Server Error"
        }
    }
}