import { GetJob } from "@/actions/jobs/get-job"
import { Job } from "@prisma/client"
import { redirect } from "next/navigation";
import { EditJobCard } from "@/components/cards/edit-job";
import { Session } from "next-auth";
import { auth } from "@/auth";
import { AuthorizeUserToEditJob } from "@/actions/user/authorize-user-job";

export default async function Page({ params } : { params: Promise<{ workspace: string, jobId: string }>}) {
    const session:Session | null = await auth();
    if(!session) {
        redirect('/')
    }
    const authorizejob = await AuthorizeUserToEditJob(await((await params).jobId));
    const job = await GetJob(await((await params).jobId));
    console.log(job);
    if(job.error) {
        redirect(`/${await((await params).workspace)}/jobs`)
    }
    return (
        <>
        <h1 className="font-bold text-3xl tracking-tight">Job Information</h1>
        <EditJobCard job={job.job as Job} />
        </>
    )
}