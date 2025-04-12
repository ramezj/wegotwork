'use server'
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function GetOrganizationCategories() {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { redirect('/') }
    try {
        const categories = await prisma.jobCategory.findMany({
            where: {
                organizationId: session.user?.currentOrganizationId!
            },
            orderBy: {
                order: "asc"
            }
        })
        revalidatePath('/categories');
        return {
            categories: categories
        }
    } catch (error: unknown) {
        if(error instanceof Error) {
            return {
                error: true,
                message: error.message
            }
        }
    }
}