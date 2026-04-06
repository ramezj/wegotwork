import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { jobsBySlugQueryOptions } from "@/features/queries/jobs";
import { ListFilter } from "lucide-react";
import { Job, Candidate } from "generated/prisma/client";
import { Layout } from "@/components/shared/layout";
import { JobCardForCandidatesPage } from "@/components/job/job-card";
import { CreateJobDialog } from "@/components/job/create-job-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

export const Route = createFileRoute("/$slug/_layout/candidates/")({
  validateSearch: z.object({
    status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED", "CLOSED"]).optional(),
  }),
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      jobsBySlugQueryOptions(params.slug),
    ),
  head: () => ({
    meta: [{ title: "Candidates", content: "Manage job applicants" }],
  }),
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { status } = Route.useSearch();
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(
    jobsBySlugQueryOptions(slug),
  ) as any;

  if (!data?.success) {
    return <div>Failed to load jobs</div>;
  }

  const jobs = (data.jobs || []) as (Job & { candidates: Candidate[] })[];
  const filteredJobs = status
    ? jobs.filter((job) => job.status === status)
    : jobs;

  const title = status
    ? `${toStatusLabel(status)} Candidates (${filteredJobs.length})`
    : `Candidates (${jobs.length})`;

  const handleStatusChange = (value: string) => {
    navigate({
      to: "/$slug/candidates",
      params: { slug },
      search: value === "ALL" ? {} : { status: value as SearchStatus },
    });
  };

  // if (jobs.length === 0) {
  //   return (
  //     <Layout
  //       title="Candidates (0)"
  //       primaryButton={<CreateJobDialog slug={slug} />}
  //     >
  //       <div className="flex flex-1 items-center justify-center border">
  //         <div className="flex max-w-sm flex-col items-center justify-center gap-2 text-center">
  //           <h2 className="text-base font-semibold tracking-tight text-muted-foreground">
  //             No jobs found
  //           </h2>
  //           <CreateJobDialog slug={slug} />
  //         </div>
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout
      variant="header"
      title={title}
      primaryButton={
        <div className="flex items-center gap-2">
          <Select value={status || "ALL"} onValueChange={handleStatusChange}>
            <SelectTrigger
              aria-label="Filter candidates by job status"
              className="w-9 justify-center px-0 md:w-40 md:justify-between md:px-3 [&>svg:last-child]:hidden md:[&>svg:last-child]:block"
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
      {filteredJobs.length === 0 ? (
        <div className="flex flex-1 items-center justify-center border">
          <div className="flex max-w-sm flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-muted-foreground">
              No jobs match this filter
            </h2>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <JobCardForCandidatesPage
              key={job.id}
              job={job}
              slug={slug}
              candidates={job.candidates.length}
            />
          ))}
        </div>
      )}
    </Layout>
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
