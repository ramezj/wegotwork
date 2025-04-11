"use server"

import { auth } from "@/lib/auth"
import { Session } from "@/lib/auth-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export async function GetJobAsOwner(jobId: string) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) {
        redirect('/')
    }
    try {
        const job = await prisma.job.findFirst({
            where: {
                id: jobId
            },
            include: {
                applicants: true,
                category: true
            }
        });
        if(!job) {
            return {
                error: true,
                message:"Job Not Found"
            }
        }
        const categories = await prisma.jobCategory.findMany({
            where: {
                organizationId:session.user.currentOrganizationId!
            },
            orderBy: {
                name: "asc"
            }
        })
        const permissions = await prisma.organizationUser.findFirst({
            where: {
                userId: session.user.id,
                organizationId: job.organizationId
            }
        });
        if(!permissions) {
            return {
                error: true,
                message:"Not Allowed"
            }
        }
        return { 
            job: job,
            categories: categories
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message:"Internal Server Error"
        }
    }
}

export async function GetJobAsOwnerWithApplicants(jobId: string) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) {
        redirect('/')
    }
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
                message:"Job Not Found"
            }
        }
        const permissions = await prisma.organizationUser.findFirst({
            where: {
                userId: session.user.id,
                organizationId: job.organizationId
            }
        });
        if(!permissions) {
            return {
                error: true,
                message:"Not Allowed"
            }
        }
        return { 
            job
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            message:"Internal Server Error"
        }
    }
}