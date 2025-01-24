
'use server'
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";

export async function CreateJobAction(title: string, id: string) {
    const session:Session | null = await auth();
    if(!session) { redirect('/') }
    try {
        const workspace = await prisma.workspace.findFirst({
            where: {
                id: id
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
        revalidatePath(`/${id}/jobs`);
        return {
            job
        }
    } catch (error) {
        console.error(error);
        return { error };
    }
}