
'use server'
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { Session } from "next-auth";

export async function CreateJobAction(title: string, workspaceId: string) {
    const session:Session | null = await auth();
    if(!session) { redirect('/') }
    try {
        const job = await prisma.job.create({
            data: {
                title: "test title 123",
                type:"fulltime",
                content: "New Job!",
                workspaceId: "cm5dowima00026o5eqmpziahc"
            }
        })
        console.log(job);
        return {
            job
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}