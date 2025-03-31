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
import { getApplicantById } from "@/actions/applicants/get-applicant";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata:Metadata = {
    title: "applicants",
    description: "applicants"
}

export default async function Page({ params } : { params: Promise<{ organization: string, jobId: string, applicantId: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    });
    if(!session) { redirect('/')}
    const applicant = await getApplicantById((await params).applicantId)
    console.log(applicant);
    // if(applicant?.error) {
    //     redirect('/')
    // }
    return (
        <>
        <div className="flex items-center justify-between w-full">
        <h1 className="font-extrabold text-4xl text-black tracking-tight">View Applicants</h1>
        {/* <CreateJob id={await((await (params)).organization)} buttonSize="sm" buttonColor="white" /> */}
        </div>
        {JSON.stringify(applicant)}
        <Button asChild>
            <Link href={applicant?.url!}>
            CV
            </Link>
            </Button>
        </>
    )
}