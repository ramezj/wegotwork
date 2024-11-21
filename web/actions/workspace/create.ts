
'use server'
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";

export async function CreateWorkspace(name: string) {
    const session = await auth();
    if(!session) { redirect('/') }
    try {
        const workspace = await prisma.workspace.create({
            data: {
                name: name,
                users: {
                    create: {
                        userId: session.user?.id as string
                    }
                }
            }
        })
        return {
            workspace: workspace
        }
    } catch (error) {
        console.error(error);
    }
}