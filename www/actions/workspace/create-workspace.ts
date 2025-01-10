
'use server'
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";

export async function CreateWorkspace(name: string, slug: string) {
    const session:Session | null = await auth();
    if(!session) { redirect('/') }
    try {
        const workspaceExist = await prisma.workspace.findFirst({
            where: {
                slug
            }
        })
        if(workspaceExist) {
            return { 
                error:true,
                message:"Slug in-use, please use another slug"
            }
        }
        const workspace = await prisma.workspace.create({
            data: {
                name: name,
                slug:slug,
                users: {
                    create: {
                        userId: session.user?.id as string,
                        role: 'owner'
                    }
                }
            }
        })
        revalidatePath('/dashboard')
        return {
            workspace: workspace
        }
    } catch (error) {
        console.error(error);
    }
}