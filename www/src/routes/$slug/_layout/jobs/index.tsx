import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { JobCard } from "@/components/job/job-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { jobsBySlugQueryOptions } from "@/features/queries/jobs";
import { Layout } from "@/components/shared/layout";
import { CreateJobDialog } from "@/components/job/create-job-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown, ListFilter } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/$slug/_layout/jobs/")({
  validateSearch: z.object({
    status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED", "CLOSED"]).optional(),
  }),
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      jobsBySlugQueryOptions(params.slug),
    );
  },
  head: () => ({
    meta: [{ title: "Jobs", content: "Jobs" }, { name: "Jobs" }],
  }),
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { status } = Route.useSearch();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(jobsBySlugQueryOptions(slug)) as any;
  const jobs = data?.jobs || [];

  const filteredJobs = status
    ? jobs.filter((job: any) => job.status === status)
    : jobs;

  const title = status
    ? `${toStatusLabel(status)} Jobs (${filteredJobs.length})`
    : `Job Openings (${jobs.length})`;

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
        variant="header"
        title={title}
        primaryButton={
          <div className="flex items-center gap-2">
            <Select value={status || "ALL"} onValueChange={handleStatusChange}>
              <SelectTrigger
                asChild
                aria-label="Filter jobs by status"
                className="w-9 justify-center px-0 md:w-40 md:justify-between md:px-3"
              >
                <Button type="button" variant="outlineSecondary">
                  <ListFilter className="size-4 md:hidden" />
                  <span className="sr-only md:not-sr-only md:flex md:flex-1 md:items-center md:text-left">
                    <SelectValue placeholder="Filter jobs" />
                  </span>
                  <ChevronDown className="text-muted-foreground hidden size-4 opacity-50 md:block" />
                </Button>
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
        {filteredJobs.length === 0 ? (
          <div className="flex flex-1 items-center justify-center border">
            <div className="flex max-w-sm flex-col items-center justify-center gap-2 text-center">
              <h2 className="text-xl font-semibold tracking-tight text-muted-foreground">
                No jobs found
              </h2>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {filteredJobs.map((job: any) => (
              <JobCard slug={slug} key={job.id} job={job} />
            ))}
          </div>
        )}
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
