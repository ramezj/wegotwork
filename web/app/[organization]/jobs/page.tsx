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
    title: "jobs",
    description: "jobs"
}

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { redirect('/')}
    const jobs = await GetOrganizationJobs(await((await params).organization));
    if(jobs?.error) {
        redirect('/');
    }
    return (
        <>
            { jobs?.jobs?.jobs.length === 0 
            ?
            <>
            <div className="flex items-center justify-between w-full">
            <h1 className="font-extrabold text-4xl text-black tracking-tight">jobs</h1>
            <CreateJob id={await((await (params)).organization)} buttonSize="sm" buttonColor="white" />
            </div>
            <div className="w-full border border-black bg-white h-full rounded-none items-center flex flex-col gap-3 justify-center">
                <div>
                <h1 className="font-extrabold text-black text-xl text-center">you don't have any jobs yet</h1>
                <p className="text-black font-medium text-md">create some jobs & start hiring immediately</p>
                </div>
                <CreateJob id={await((await (params)).organization)} buttonSize={"sm"} buttonColor="black" />
            </div>
            </>
            : 
            <>
             <div className="flex justify-between items-center w-full">
                <h1 className="font-extrabold text-4xl text-black tracking-tight">jobs</h1>
                <CreateJob id={await((await (params)).organization)} buttonSize={"sm"} buttonColor="white" />
                </div>
                <div className="gap-4 flex flex-col">
                {
                jobs?.jobs?.jobs.map((job:Job) => {
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