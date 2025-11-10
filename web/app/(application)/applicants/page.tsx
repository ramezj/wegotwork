import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GetJobApplicants } from "@/actions/applicants/get-job-applicants";
import { GetOrganizationJobs } from "@/actions/jobs/get-all-jobs";
import CreateJob from "@/components/create-job";
import { Job } from "@prisma/client";
import { JobCardForApplicants } from "@/components/cards/job";
import { Prisma } from "@prisma/client";

type JobWithApplicants = Prisma.JobGetPayload<{
  include: {
    applicants: true;
  };
}>;

export const metadata: Metadata = {
  title: "Applicants",
  description: "Applicants",
};

export default async function Page() {
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  if (session.user.currentOrganizationId === null) {
    redirect("/dashboard");
  }
  const jobs = await GetOrganizationJobs(session.user.currentOrganizationId!);
  if (jobs?.error) {
    redirect("/");
  }
  return (
    <>
      {jobs?.jobs?.jobs.length === 0 ? (
        <>
          <div className="flex items-center justify-between w-full">
            <h1 className="font-extrabold text-3xl text-foreground tracking-tight">
              Applicants
            </h1>
            <CreateJob id={session.user.currentOrganizationId!} />
          </div>
          <div className="w-full border border-dashed border-foreground/20 dark:bg-black bg-gray-200 h-full rounded-none items-center flex flex-col gap-3 justify-center text-center">
            <div>
              <h1 className="font-bold text-foreground text-xl text-center px-2">
                No Jobs Found
              </h1>
            </div>
            {/* <CreateJob id={session.user.currentOrganizationId!}/> */}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center w-full">
            <h1 className="font-extrabold text-3xl text-foreground tracking-tight">
              Applicants
            </h1>
            <CreateJob id={session.user.currentOrganizationId!} />
          </div>
          <div className="gap-4 flex flex-col">
            {jobs?.jobs?.jobs.map((job: JobWithApplicants) => {
              return (
                <div className="relative" key={job.id}>
                  <JobCardForApplicants
                    job={job}
                    applicants={job.applicants.length}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
