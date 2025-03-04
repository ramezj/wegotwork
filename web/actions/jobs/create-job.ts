
'use server'
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function CreateJobAction(title: string, id: string) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { redirect('/') }
    try {
        const organization = await prisma.organization.findFirst({
            where: {
                id: id
            }
        })
        if(!organization) {
            return { 
                error: true,
                message: "Workspace not found"
            }
        }
        const job = await prisma.job.create({
            data: {
                title: title,
                content: "",
                organizationId: organization.id
            }
        })
        revalidatePath(`/${id}/jobs`);
        return {
            error:false,
            job:job
        }
    } catch (error) {
        console.error(error);
        return { 
            error:true,
            message:error
        };
    }
}