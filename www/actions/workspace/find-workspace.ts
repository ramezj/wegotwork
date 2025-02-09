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
                id: true,
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
        const uniqueLocations = await prisma.job.findMany({
            where: {
                workspaceId: workspace.id,
                location: {
                    not: null
                }
            },
            select: {
                location: true
            },
            distinct: ['location']
        })
        const locations = uniqueLocations.map(job => job.location);
        console.log(locations);
        return {
            error: false,
            workspace: workspace,
            locations:locations,
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