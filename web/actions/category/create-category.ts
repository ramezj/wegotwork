
'use server'
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function CreateCategoryAction(categoryName: string) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { redirect('/') }
    try {
        const maxOrderCategory = await prisma.jobCategory.findFirst({
            where: {
                organizationId: session.user.currentOrganizationId!
            },
            orderBy: {
                order: "desc"
            },
            select: {
                order: true
            }
        })
        const newOrder = maxOrderCategory?.order ? maxOrderCategory.order + 1 : 1;
        const category = await prisma.jobCategory.create({
            data: {
                organizationId: session.user.currentOrganizationId!,
                name:categoryName,
                order: newOrder
            }
        })
        revalidatePath("/categories", 'page');
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
        return { 
            error:true,
            message:error
        };
    }
}