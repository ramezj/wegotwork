
"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";

export async function GetOrganization(organizationId: string) {
    const session: Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) { redirect('/') }
    console.log(session.user.id);
    console.log(organizationId);
    try {
        const organization = await prisma.organizationUser.findFirst({
            where: {
                userId: session.user?.id,
                id: organizationId
            },
            include: {
                organization: {
                    include: {
                        users: {
                            include: {
                                user: true
                            }
                        },
                        jobs:true
                    }
                }
            }
        })
        return ( organization )
    } catch (error) {
        console.error(error);
    }
}