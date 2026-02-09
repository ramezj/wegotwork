import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { useMemo, useState } from "react";
import { JobCard } from "@/components/job/job-card";
import { JobWithCategory } from "@/features/types/job/job";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

export const Route = createFileRoute("/view/$slug/")({
  component: RouteComponent,
});

function Header({ name }: { name: string }) {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="w-full mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-semibold truncate max-w-[200px] sm:max-w-md">
            {name}
          </h1>
        </div>
      </div>
    </header>
  );
}

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

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return "All Jobs";
    return (
      data.organization?.categories?.find((c) => c.id === selectedCategory)
        ?.name || "All Jobs"
    );
  }, [selectedCategory, data.organization?.categories]);

  return (
    <div>
      {/* <Header name={data.organization.name} /> */}
      <div className="flex flex-col items-center justify-center py-12 px-4 space-y-12 w-full max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
            {data.organization.name}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance font-light">
            Explore our open positions and join our team in building the future.
          </p>
        </div>

        <div className="w-full max-w-6xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b pb-6">
            <div className="flex flex-col space-y-1 text-left w-full sm:w-auto">
              <h2 className="text-xl font-medium">
                Available Positions ({filteredJobs.length})
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[200px] justify-between font-normal"
                  >
                    <span className="truncate">{selectedCategoryName}</span>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center justify-between"
                  >
                    <span>All Jobs</span>
                    {!selectedCategory && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                  {data.organization.categories?.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center justify-between"
                    >
                      <span className="truncate">{category.name}</span>
                      {selectedCategory === category.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  slug={slug}
                  job={job as JobWithCategory}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center">
                No job openings found for this category.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
