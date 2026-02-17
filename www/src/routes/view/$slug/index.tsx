import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { JobCard, JobCardForViewPage } from "@/components/job/job-card";
import { CategoryWithJob, JobWithCategory } from "@/features/types/job/job";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/view/$slug/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(viewOrganizationBySlugQueryOptions(slug));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!data.organization) return <Navigate to="/" />;

  const jobs = data.organization.jobs || [];
  const categories = data.organization.categories || [];

  // Get all category IDs for filtering
  const categoryIds = new Set(categories.map((c) => c.id));

  // Find jobs without a valid category
  const uncategorizedJobs = jobs.filter(
    (job) => !job.categoryId || !categoryIds.has(job.categoryId),
  );

  // Filter categories based on selected category
  const filteredCategories = selectedCategory
    ? categories.filter(
        (cat: CategoryWithJob) =>
          cat.id === selectedCategory && cat.jobs.length > 0,
      )
    : categories.filter((cat: CategoryWithJob) => cat.jobs.length > 0);

  // Show uncategorized jobs only when no specific category is selected
  const showUncategorized = !selectedCategory;

  // Get selected category name for display
  const selectedName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name || "All Jobs"
    : "All Jobs";

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-8 w-full max-w-7xl mx-auto">
      <div className="text-center flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24 rounded-none">
          <AvatarImage
            src={`${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${data.organization.logo}`}
          />
          <AvatarFallback className="text-4xl rounded-none bg-white text-black">
            {data.organization.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight leading-none">
            {data.organization.name}
          </h1>
          <p className="text-muted-foreground text-base text-balance font-light leading-none">
            Explore our open positions and join our team in building the future.
          </p>
        </div>
      </div>

      <div className="w-full max-w-6xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b pb-4">
          <h2 className="text-xl font-medium">
            Available Positions ({jobs.length})
          </h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[200px] justify-between font-normal"
              >
                <span className="truncate">{selectedName}</span>
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
              {categories
                .filter((cat: CategoryWithJob) => cat.jobs.length > 0)
                .map((category: CategoryWithJob) => (
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

        <div className="space-y-4">
          {filteredCategories.map((category: CategoryWithJob) => (
            <section key={category.id} className="space-y-2">
              <h3 className="text-xl font-medium">{category.name}</h3>
              <div className="grid gap-4">
                {category.jobs.map((job) => (
                  <JobCardForViewPage
                    key={job.id}
                    slug={slug}
                    job={{ ...job, category } as JobWithCategory}
                  />
                ))}
              </div>
            </section>
          ))}
          {showUncategorized && uncategorizedJobs.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xl font-medium">Other Openings</h3>
              <div className="grid gap-4">
                {uncategorizedJobs.map((job) => (
                  <JobCardForViewPage
                    key={job.id}
                    slug={slug}
                    job={job as JobWithCategory}
                  />
                ))}
              </div>
            </section>
          )}

          {jobs.length === 0 && (
            <p className="text-muted-foreground text-center py-12">
              No job openings found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
