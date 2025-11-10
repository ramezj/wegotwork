import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { redirect } from "next/navigation";
// import { Job } from "@prisma/client";
import { GetOrganizationJobs } from "@/actions/jobs/get-all-jobs";
import CreateJob from "@/components/create-job";
import { JobCardForDashboard } from "@/components/cards/job";
import { Job, JobCategory } from "@prisma/client";
import { headers } from "next/headers";
import { Metadata } from "next";
import { GetJobAsOwner } from "@/actions/jobs/get-job-owner";
import { EditJobCard } from "@/components/edit-job";
import { DeleteJobButton } from "@/components/delete-job";
import { Applicants, TotalApplicants } from "@/components/statistics";
import { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Jobs",
};

type JobWithCategory = Prisma.JobGetPayload<{
  include: {
    category: true;
  };
}>;

export default async function Page({
  params,
}: {
  params: Promise<{ organization: string; jobId: string }>;
}) {
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  if (session.user.currentOrganizationId === null) {
    redirect("/dashboard");
  }
  const job = await GetJobAsOwner((await params).jobId);
  if (job.error) {
    redirect("/jobs");
  }
  return (
    <>
      <div className="flex justify-between items-center w-full">
        <h1 className="font-extrabold text-3xl text-white tracking-tight">
          {job.job?.title}
        </h1>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <TotalApplicants
            title="Applicants"
            amount={job.job?.applicants.length as number}
          />
          <TotalApplicants
            title="Applicants"
            amount={job.job?.applicants.length as number}
          />
        </div>
        <EditJobCard
          job={job.job as JobWithCategory}
          categories={job.categories as JobCategory[]}
        />
      </div>
    </>
  );
}
