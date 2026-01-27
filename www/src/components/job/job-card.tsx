import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Loader, Loader2, LoaderPinwheel, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Job } from "generated/prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/queries/organization";
import { Navigate } from "@tanstack/react-router";
import { Skeleton } from "../ui/skeleton";
import { Layout } from "../shared/layout";

export function JobsDashboard({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  if (!data?.organization) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <Layout
      title="Job Openings"
      primaryButton={<Button>Create</Button>}
      boldText={data?.organization?.jobs?.length?.toString() || "0"}
    >
      <div className="flex flex-col space-y-4">
        {data?.organization?.jobs?.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </Layout>
  );
}

export function JobsDashboardSkeleton() {
  return (
    <Layout
      title="Job Openings"
      primaryButton={<Button>Create</Button>}
      boldText={"0"}
    >
      <div className="flex-1 items-center flex flex-col justify-center">
        <LoaderPinwheel className="size-8 animate-spin text-foreground" />
      </div>
    </Layout>
  );
}

export function JobCardSkeleton() {
  return (
    <Card className="w-full flex flex-row border rounded-none items-center p-5 cursor-pointer shadow-none gap-0">
      <div className="flex flex-col items-start text-left py-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="ml-auto">
        <Skeleton className="size-4" />
      </div>
    </Card>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="w-full flex flex-row border rounded-none items-center p-5 cursor-pointer shadow-none gap-0">
      <div className="flex flex-col items-start text-left py-2">
        <p className="sm:text-lg text-md font-medium text-left text-foreground">
          {job.title}
        </p>
        <div className="flex">
          <p className="text-xs text-white font-medium">
            {formatDistanceToNow(job.createdAt)} ago
          </p>
        </div>
      </div>
      <div className="ml-auto">
        <Button size={"sm"} variant={"default"} className="rounded-none">
          <Settings className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
