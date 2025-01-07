
'use server'
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { Session } from "next-auth";

export async function CreateJobAction(title: string, workspaceId: string) {
    const session:Session | null = await auth();
    if(!session) { redirect('/') }
    console.log(title, workspaceId);
    try {
        const job = await prisma.job.create({
            data: {
                title: title,
                content: "",
                workspaceId: workspaceId
            }
        })
        return {
            job
        }
    } catch (error) {
        return error;
    }
}