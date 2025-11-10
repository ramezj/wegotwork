import { getJobById } from "@/actions/jobs/get-job";
import { Job, Type } from "@prisma/client";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ApplyCard from "@/components/apply-card";
// import { getOrganizationBySlug } from "@/server-actions/organization/get-organization";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatJobType } from "@/lib/format-job";
import { formatDistanceToNow } from "date-fns";
// import { Toggle } from "@/components/toggle";
import { CareerNavbar } from "@/components/career-navbar";
import { Organization } from "@prisma/client";
import { FindOrganization } from "@/actions/organization/find-organization";
import { MapPin, Briefcase, Banknote } from "lucide-react";
import { Prisma } from "@prisma/client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ organization: string; jobId: string }>;
}): Promise<Metadata> {
  const job = await getJobById((await params).jobId);
  return {
    title: job.job?.title,
  };
}

type OrganizationWithJobs = Prisma.OrganizationGetPayload<{
  include: {
    categories: {
      include: {
        jobs: {
          include: {
            category: true;
          };
        };
      };
    };
    jobs: {
      include: {
        category: true;
      };
    };
  };
}>;

export default async function Page({
  params,
}: {
  params: Promise<{ organization: string; jobId: string }>;
}) {
  const organization = await FindOrganization((await params).organization);
  if (organization.error) {
    notFound();
  }
  const job = await getJobById((await params).jobId);
  if (job?.error) {
    redirect("/");
  }
  return (
    <main className="">
      <div className="top-0 z-10 sticky">
        <CareerNavbar
          organization={organization.organization as OrganizationWithJobs}
        />
      </div>
      <div className="w-full flex flex-col items-center text-center py-8 gap-y-4">
        <div className="text-center w-full flex flex-col">
          <h1 className="font-medium text-white text-2xl">{job.job?.title}</h1>
          <p className="text-sm max-w-3xl text-white text-center mx-auto">
            {formatDistanceToNow(job.job?.createdAt!)} ago{" "}
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            size={"sm"}
            variant={"outline"}
            className="rounded-none bg-theme hover:bg-theme border border-dashed"
          >
            <Briefcase className="size-4" />
            {formatJobType(job.job?.type as Type)}
          </Button>
          {job?.job?.country ? (
            <Button
              size={"sm"}
              variant={"outline"}
              className="rounded-none bg-theme hover:bg-theme border border-dashed"
            >
              <MapPin className="size-4" />
              {job.job?.city === null ? "" : job.job.city + ", "}
              {job.job.country}
            </Button>
          ) : (
            <></>
          )}
        </div>
        {job.job?.content ? (
          <>
            <div
              className="lg:w-1/2 w-full rounded-none text-white bg-theme border border-white/20 font-medium p-7 text-left"
              dangerouslySetInnerHTML={{ __html: job.job?.content! }}
            />
          </>
        ) : (
          <></>
        )}
        <div className="px-4 w-full flex flex-col items-center content-center">
          <ApplyCard jobId={(await params).jobId} />
        </div>
      </div>
    </main>
  );
}
