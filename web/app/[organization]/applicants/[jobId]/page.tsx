import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { redirect } from "next/navigation";
// import { Job } from "@prisma/client";
import { GetOrganizationJobs } from "@/actions/jobs/get-all-jobs";
import CreateJob from "@/components/create-job";
import { JobCardForDashboard } from "@/components/cards/job";
import { Applicant, Job } from "@prisma/client";
import { headers } from "next/headers";
import { Metadata } from "next";
import { GetJobAsOwnerWithApplicants } from "@/actions/jobs/get-job-owner";
import { EditJobCard } from "@/components/edit-job";
import { GetJobApplicants } from "@/actions/applicants/get-job-applicants";
import ApplicantCard from "@/components/cards/applicant";

export const metadata:Metadata = {
    title: "applicants",
    description: "applicants"
}

export default async function Page({ params } : { params: Promise<{ organization: string, jobId: string }>}) {
    const organization = (await params).organization;
    const jobId = (await params).jobId;
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { redirect('/')}
    const job = await GetJobApplicants((await params).jobId)
    if(job.error) {
        redirect('/')
    }
    return (
        <>
        <div className="flex items-center justify-between w-full">
        <h1 className="font-extrabold text-4xl text-black tracking-tight">View Applicants</h1>
        {/* <CreateJob id={await((await (params)).organization)} buttonSize="sm" buttonColor="white" /> */}
        </div>
        {job.applicants?.map((applicant: Applicant) => {
            return (
                <div key={applicant.id}>
                    <ApplicantCard applicant={applicant} organization={organization} jobId={jobId} />
                </div>
            )
        })}
        </>
    )
}