"use server"
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function FindOrganization(slug: string) {
    try {
        const organization = await prisma.organization.findFirst({
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
        if(!organization) {
            return {
                error:true,
                organization: null,
                message:"Workspace Not Found"
            }
        }
        const uniqueLocations = await prisma.job.findMany({
            where: {
                organizationId: organization.id,
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
        const uniqueEmploymentTypes = await prisma.job.findMany({
            where: {
                organizationId: organization.id
            },
            select: {
                type: true
            },
            distinct: ['type']
        })
        const types = uniqueEmploymentTypes.map(job => job.type);
        return {
            error: false,
            organization: organization,
            locations:locations,
            types: types,
            message:"Organization Found"
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            organization:null,
            message: "Something went wrong"
        }
    }
}