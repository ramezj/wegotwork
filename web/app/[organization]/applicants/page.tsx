import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { Session } from "@/lib/auth-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { GetJobApplicants } from "@/actions/applicants/get-job-applicants"
import { GetOrganizationJobs } from "@/actions/jobs/get-all-jobs"
import CreateJob from "@/components/create-job"
import { Job } from "@prisma/client"
import { JobCardForApplicants } from "@/components/cards/job"

export const metadata:Metadata = {
    title: "applicants",
    description: "applicants"
}

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const session: Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) {
        redirect('/')
    }
    const jobs = await GetOrganizationJobs((await params).organization);
    if(jobs?.error) {
        redirect('/');
    }
    return (
            <>
                { jobs?.jobs?.jobs.length === 0 
                ?
                <>
                <div className="flex items-center justify-between w-full">
                <h1 className="font-extrabold text-4xl text-black tracking-tight">applicants</h1>
                <CreateJob id={await((await (params)).organization)} buttonSize="sm" buttonColor="white" />
                </div>
                <div className="w-full border border-black bg-white h-full rounded-sm items-center flex flex-col gap-3 justify-center">
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
                    <h1 className="font-extrabold text-4xl text-black tracking-tight">applicants</h1>
                    <CreateJob id={await((await (params)).organization)} buttonSize={"sm"} buttonColor="white" />
                    </div>
                    <div className="gap-4 flex flex-col">
                    {
                    jobs?.jobs?.jobs.map((job:Job) => {
                        return (
                        <div className="relative" key={job.id}>
                        <JobCardForApplicants job={job}/>
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