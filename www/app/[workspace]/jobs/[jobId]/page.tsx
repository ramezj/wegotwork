import { GetJob } from "@/actions/jobs/get-job"
import { Job } from "@prisma/client"
import { redirect } from "next/navigation";

export default async function Page({ params } : { params: Promise<{ workspace: string, jobId: string }>}) {
    const job = await GetJob(await((await params).jobId));
    if(job.error) {
        redirect(`/${await((await params).workspace)}/jobs`)
    }
    return (
        <>
        workspace : {await((await params).workspace)}
        jobId: {await((await params).jobId)}
        </>
    )
}