import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { JobCardForViewPage } from "@/components/job/job-card";
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

const EMPLOYMENT_TYPES = [
  { value: "FULLTIME", label: "Full-time" },
  { value: "PARTTIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
] as const;

const LOCATION_MODES = [
  { value: "REMOTE", label: "Remote" },
  { value: "ONSITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  const selectedLabel = selected
    ? options.find((o) => o.value === selected)?.label
    : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="justify-between font-normal w-full"
        >
          <span className="truncate">{selectedLabel ?? label}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[160px]">
        <DropdownMenuItem
          onClick={() => onSelect(null)}
          className="flex items-center justify-between"
        >
          <span>All</span>
          {!selected && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="flex items-center justify-between"
          >
            <span>{option.label}</span>
            {selected === option.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(viewOrganizationBySlugQueryOptions(slug));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  if (!data.organization) return <Navigate to="/" />;

  const jobs = data.organization.jobs || [];
  const categories = data.organization.categories || [];

  // Get all category IDs for filtering
  const categoryIds = new Set(categories.map((c) => c.id));

  // Apply employment type and location filters to a job list
  const applyFilters = <T extends (typeof jobs)[number]>(jobList: T[]) =>
    jobList.filter((job) => {
      if (selectedType && job.type !== selectedType) return false;
      if (selectedLocation && job.locationMode !== selectedLocation)
        return false;
      return true;
    }) as T[];

  // Find jobs without a valid category (after applying filters)
  const uncategorizedJobs = applyFilters(
    jobs.filter((job) => !job.categoryId || !categoryIds.has(job.categoryId)),
  );

  // Filter categories based on selected category, then apply other filters
  const filteredCategories = (
    selectedCategory
      ? categories.filter((cat: CategoryWithJob) => cat.id === selectedCategory)
      : categories
  )
    .map((cat: CategoryWithJob) => ({
      ...cat,
      jobs: applyFilters(cat.jobs),
    }))
    .filter((cat) => cat.jobs.length > 0);

  // Show uncategorized jobs only when no specific category is selected
  const showUncategorized = !selectedCategory;

  // Total visible jobs count
  const visibleCount =
    filteredCategories.reduce((sum, cat) => sum + cat.jobs.length, 0) +
    (showUncategorized ? uncategorizedJobs.length : 0);

  const hasActiveFilters = selectedCategory || selectedType || selectedLocation;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-4 w-full max-w-6xl mx-auto ">
      <div className="w-full">
        <div className="text-center flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24 rounded-none">
            <AvatarImage
              src={`${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${data.organization.logo}`}
            />
            <AvatarFallback className="text-4xl rounded-none bg-white text-black">
              {data.organization.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight">
              {data.organization.name}
            </h1>
            <p className="text-muted-foreground text-base text-balance font-light">
              Explore our open positions and join our team in building the
              future.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Open Roles ({visibleCount})</h2>
            {/* {hasActiveFilters && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedType(null);
                  setSelectedLocation(null);
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear filters
              </button>
            )} */}
          </div>

          <div className="flex sm:flex-row flex-col gap-2">
            <div className="flex-1">
              <FilterDropdown
                label="Category"
                options={categories
                  .filter((cat: CategoryWithJob) => cat.jobs.length > 0)
                  .map((cat: CategoryWithJob) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
            <div className="flex-1">
              <FilterDropdown
                label="Employment Type"
                options={EMPLOYMENT_TYPES}
                selected={selectedType}
                onSelect={setSelectedType}
              />
            </div>
            <div className="flex-1">
              <FilterDropdown
                label="Location"
                options={LOCATION_MODES}
                selected={selectedLocation}
                onSelect={setSelectedLocation}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCategories.map((category: CategoryWithJob) => (
            <section key={category.id} className="space-y-4">
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
            <section className="space-y-4">
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

          {visibleCount === 0 && (
            <p className="text-muted-foreground text-center py-12">
              {hasActiveFilters
                ? "No jobs match the selected filters."
                : "No job openings found."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
