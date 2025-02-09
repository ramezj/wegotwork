"use server"
import prisma from "@/lib/db"
import { redirect } from "next/navigation";

export async function FindWorkspace(slug: string) {
    try {
        const workspace = await prisma.workspace.findFirst({
            where: {
                slug: slug
            },
            select: {
                name: true,
                slug: true,
                description: true,
                jobs: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
        if(!workspace) {
            return {
                error:true,
                workspace: null,
                message:"Workspace Not Found"
            }
        }
        return {
            error: false,
            workspace: workspace,
            message:"Workspace Found"
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            workspace:null,
            message: "Something went wrong"
        }
    }
}