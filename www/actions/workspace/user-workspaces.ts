
'use server'
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { Session } from "next-auth";

export async function UserWorkspaces() {
    const session:Session | null = await auth();
    if(!session) { redirect('/') }
    try {
        const workspaces = await prisma.user.findUnique({
            where: {
                id: session.user?.id as string
            },
            include: {
                userWorkspaces: {
                    include: {
                        workspace: true
                    }
                }
            }
        })
        return {
            UserWorkspaces : workspaces?.userWorkspaces
        }
    } catch (error) {
        console.error(error);
    }
}