
'use server'
import prisma from "@/lib/db"
import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";

export async function CreateJobAction(title: string, workspaceId: string) {
    const session:Session | null = await auth();
    if(!session) { redirect('/') }
    try {
        const workspace = await prisma.workspace.findFirst({
            where: {
                slug: workspaceId
            }
        })
        console.log(workspace);
        // const job = await prisma.job.create({
        //     data: {
        //         title: "test",
        //         content: "",
        //         workspaceId: "cm5qmvkiu0002j5w1lomoma5g"
        //     }
        // })
        // console.log(job);
        // revalidatePath(`/${workspaceId}/jobs`);
        // return {
        //     job
        // }
    } catch (error) {
        return { error };
    }
}