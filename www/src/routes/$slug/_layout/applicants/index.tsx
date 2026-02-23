import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ChevronRight, Briefcase } from "lucide-react";
import { Job, Applicant } from "generated/prisma/client";

export const Route = createFileRoute("/$slug/_layout/applicants/")({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      organizationBySlugQueryOptions(params.slug),
    ),
  head: () => ({
    meta: [{ title: "Applicants | Hirelou", content: "Manage job applicants" }],
  }),
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  ) as any;

  if (!data?.success || !data?.organization) {
    return <div>Failed to load organization</div>;
  }

  const jobs = data.organization.jobs as (Job & { applicants: Applicant[] })[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
        <p className="text-muted-foreground">
          Select a job to view and manage its candidates.
        </p>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            to="/$slug/applicants/$jobId"
            params={{ slug, jobId: job.id }}
            className="block group"
          >
            <Card className="hover:border-primary/50 transition-all overflow-hidden border">
              <CardContent className="p-0">
                <div className="flex items-center p-5 gap-4">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Briefcase className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        <span>{job.applicants.length} candidates</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="capitalize text-[10px] h-4"
                      >
                        {job.status.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {jobs.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-muted/5">
            <Briefcase className="size-10 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No jobs found</h3>
            <p className="text-muted-foreground">
              You haven't posted any jobs yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
