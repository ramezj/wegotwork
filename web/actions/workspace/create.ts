
'use server'
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";

export async function CreateWorkspace() {
    const session = await auth();
    if(!session) { redirect('/') }
    try {
        const workspace = await prisma.workspace.create({
            data: {
                name: "workspace-2",
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