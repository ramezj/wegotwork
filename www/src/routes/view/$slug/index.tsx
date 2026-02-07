import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job/job-card";

export const Route = createFileRoute("/view/$slug/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(viewOrganizationBySlugQueryOptions(slug));
  if (!data.organization) {
    return <Navigate to="/" />;
  }
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    if (!data.organization?.jobs) return [];
    if (!selectedCategory) return data.organization.jobs;
    return data.organization.jobs.filter(
      (job) => job.categoryId === selectedCategory,
    );
  }, [data.organization?.jobs, selectedCategory]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          {data.organization.name}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore our open positions and join our team in building the future.
        </p>
      </div>

      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            All Jobs
          </Button>
          {data.organization.categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div className="flex flex-col space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard slug={slug} key={job.id} job={job as any} />
            ))
          ) : (
            <div className="text-center py-12 bg-input/10 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                No job openings found for this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
