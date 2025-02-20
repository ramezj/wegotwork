import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { redirect } from "next/navigation";
// import { Job } from "@prisma/client";
import { GetOrganizationJobs } from "@/actions/jobs/get-all-jobs";
import CreateJob from "@/components/create-job";
import { JobCardForDashboard } from "@/components/cards/job";
import { Job } from "@prisma/client";
import { headers } from "next/headers";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: "Jobs",
    description: "Jobs"
}

export default async function Page({ params } : { params: Promise<{ workspace: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { redirect('/')}
    const jobs = await GetOrganizationJobs(await((await params).workspace))
    return (
        <>
            { jobs?.jobs.length === 0 
            ?
            <>
            <div className="flex items-center justify-between w-full">
            <h1 className="font-bold text-3xl tracking-tight">Jobs</h1>
            <CreateJob id={await((await (params)).workspace)} buttonSize="sm" />
            </div>
            <div className="w-full border border-white/20 h-full rounded-lg items-center flex flex-col gap-3 justify-center">
                <div>
                <h1 className="font-bold text-xl text-center">You dont have any jobs yet</h1>
                <p className="text-muted-foreground text-md">Create some jobs & start hiring immediately</p>
                </div>
                <CreateJob id={await((await (params)).workspace)} buttonSize={"sm"} />
            </div>
            </>
            : 
            <>
             <div className="flex justify-between items-center w-full">
                <h1 className="font-bold text-3xl tracking-tight">Jobs</h1>
                <CreateJob id={await((await (params)).workspace)} buttonSize={"sm"} />
                </div>
                <div className="gap-4 flex flex-col">
                {
                jobs?.jobs.map((job:Job) => {
                    return (
                    <div className="relative" key={job.id}>
                    <JobCardForDashboard job={job}/>
                    </div>
                    )
                })
                }
                </div>
            </>
            }
        </>
    )
}