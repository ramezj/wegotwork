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
import { BaseLayout } from "@/components/base-layout";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Jobs",
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
          <BaseLayout
            title={"Jobs"}
            button={<CreateJob id={session.user.currentOrganizationId!} />}
          >
            <div className="w-full border border-dashed border-foreground/20 dark:bg-black bg-gray-200 h-full rounded-none items-center flex flex-col gap-3 justify-center text-center">
              <div>
                <h1 className="font-bold text-foreground text-xl text-center px-2">
                  No Jobs Found
                </h1>
              </div>
            </div>
          </BaseLayout>
        </>
      ) : (
        <>
          <BaseLayout
            title={"Jobs"}
            button={<CreateJob id={session.user.currentOrganizationId!} />}
          >
            <div className="gap-4 flex flex-col">
              {jobs?.jobs?.jobs.map((job: Job) => {
                return (
                  <div className="relative" key={job.id}>
                    <JobCardForDashboard job={job} />
                  </div>
                );
              })}
            </div>
          </BaseLayout>
        </>
      )}
    </>
  );
}
