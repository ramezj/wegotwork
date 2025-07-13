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

export default async function Page() {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { 
        redirect('/')
    }
    if(session.user.currentOrganizationId === null) {
        redirect('/dashboard');
    }
    const jobs = await GetOrganizationJobs(session.user.currentOrganizationId!);
    if(jobs?.error) {
        redirect('/');
    }
    return (
        <>
            { jobs?.jobs?.jobs.length === 0 
            ?
            <>
            <div className="flex items-center justify-between w-full">
            <h1 className="font-extrabold text-3xl text-white tracking-tight">Jobs</h1>
            <CreateJob id={session.user.currentOrganizationId!}/>
            </div>
            <div className="w-full border border-dashed border-white/20 bg-black h-full rounded-none items-center flex flex-col gap-3 justify-center text-center">
            <div>
            <h1 className="font-medium text-white text-xl text-center px-2">No Jobs Found</h1>
            </div>
            {/* <CreateJob id={session.user.currentOrganizationId!}/> */}
            </div>
            </>
            : 
            <>
             <div className="flex justify-between items-center w-full">
                <h1 className="font-medium text-3xl text-white tracking-tight">Jobs</h1>
                <CreateJob id={session.user.currentOrganizationId!}/>
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