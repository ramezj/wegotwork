import { GetJob } from "@/actions/jobs/get-job"
import { Job } from "@prisma/client"
import { redirect } from "next/navigation";
import { EditJobCard } from "@/components/cards/edit-job";
import { Session } from "next-auth";
import { auth } from "@/auth";
import { AuthorizeUserToEditJob } from "@/actions/user/authorize-user-job";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default async function Page({ params } : { params: Promise<{ workspace: string, jobId: string }>}) {
    const session:Session | null = await auth();
    if(!session) {
        redirect('/')
    }
    const authorizejob = await AuthorizeUserToEditJob(await((await params).jobId));
    const job = await GetJob(await((await params).jobId));
    if(job.error) {
        redirect(`/${await((await params).workspace)}/jobs`)
    }
    return (
        <>
        <EditJobCard job={job.job as Job} />
        </>
    )
}