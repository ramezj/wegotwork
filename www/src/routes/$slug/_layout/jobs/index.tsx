import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { JobCard } from "@/components/job/job-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Layout } from "@/components/shared/layout";
import { CreateJobDialog } from "@/components/job/create-job-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Funnel, ListFilter } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/$slug/_layout/jobs/")({
  validateSearch: z.object({
    status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED", "CLOSED"]).optional(),
  }),
  component: RouteComponent,
  head: () => ({
    meta: [{ title: "Jobs", content: "Jobs" }, { name: "Jobs" }],
  }),
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { status } = Route.useSearch();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  if (!data.organization) {
    return <Navigate to="/dashboard" />;
  }

  const filteredJobs = status
    ? data.organization.jobs.filter((job) => job.status === status)
    : data.organization.jobs;

  const title = status
    ? `${toStatusLabel(status)} Jobs (${filteredJobs.length})`
    : `Job Openings (${data?.organization?.jobs?.length || 0})`;

  const handleStatusChange = (value: string) => {
    navigate({
      to: "/$slug/jobs",
      params: { slug },
      search: value === "ALL" ? {} : { status: value as SearchStatus },
    });
  };

  return (
    <>
      <Layout
        title={title}
        primaryButton={
          <div className="flex items-center gap-2">
            <Select value={status || "ALL"} onValueChange={handleStatusChange}>
              <SelectTrigger
                aria-label="Filter jobs by status"
                className="w-9 px-0 justify-center md:w-40 md:px-3 md:justify-between [&>svg:last-child]:hidden md:[&>svg:last-child]:block"
              >
                <>
                  <ListFilter className="size-4 md:hidden" />
                  <span className="sr-only md:not-sr-only md:flex md:flex-1 md:items-center md:text-left">
                    <SelectValue placeholder="Filter jobs" />
                  </span>
                </>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="ALL">All Jobs</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Drafts</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            <CreateJobDialog slug={slug} />
          </div>
        }
      >
        <div className="flex flex-col space-y-4">
          {filteredJobs.map((job) => (
            <JobCard slug={slug} key={job.id} job={job} />
          ))}
        </div>
      </Layout>
    </>
  );
}

type SearchStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED" | "CLOSED";

function toStatusLabel(status: SearchStatus) {
  switch (status) {
    case "PUBLISHED":
      return "Published";
    case "DRAFT":
      return "Draft";
    case "ARCHIVED":
      return "Archived";
    case "CLOSED":
      return "Closed";
  }
}
