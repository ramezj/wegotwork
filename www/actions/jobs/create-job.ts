
'use server'
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";

export async function CreateJobAction(title: string, slug: string) {
    const session:Session | null = await auth();
    if(!session) { redirect('/') }
    try {
        const workspace = await prisma.workspace.findFirst({
            where: {
                slug: slug
            }
        })
        if(!workspace) {
            return { 
                error: true,
                message: "Workspace not found"
            }
        }
        const job = await prisma.job.create({
            data: {
                title: title,
                content: "",
                workspaceId: workspace.id
            }
        })
        console.log(job);
        revalidatePath(`/${slug}/jobs`);
        return {
            job
        }
    } catch (error) {
        return { error };
    }
}