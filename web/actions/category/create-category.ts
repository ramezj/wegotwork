
'use server'
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function CreateCategoryAction(categoryName: string, order: number) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { redirect('/') }
    try {
        const category = await prisma.jobCategory.create({
            data: {
                organizationId: session.user.currentOrganizationId!,
                name:categoryName,
                order: order
            }
        })
        return {
            error:false,
            category: category
        }
    } catch (error: unknown) {
        if(error instanceof Error) {
            return {
                error:true,
                message: error.message
            }
        }
        console.error(error);
        return { 
            error:true,
            message:error
        };
    }
}