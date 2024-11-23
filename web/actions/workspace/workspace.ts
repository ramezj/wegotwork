"use server"
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";

export async function GetWorkspace(slug: string) {
    const session = await auth();
    if(!session) { redirect('/') }
    try {
        const workspace = await prisma.workspaceUser.findFirst({
            where: {
                userId: session.user?.id,
                workspace: {
                    slug: slug
                }
            },
            include: {
                workspace: true
            }
        })
        return ( workspace )
    } catch (error) {
        console.error(error);
    }
}