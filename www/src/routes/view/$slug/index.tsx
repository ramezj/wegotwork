import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { viewOrganizationBySlugQueryOptions } from "@/features/queries/organization";
import { JobCardForViewPage } from "@/components/job/job-card";
import { CategoryWithJob, JobWithCategory } from "@/types/job/job";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { buildSeo, metaDescription } from "@/lib/seo";

export const Route = createFileRoute("/view/$slug/")({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      viewOrganizationBySlugQueryOptions(params.slug),
    ),
  head: ({ loaderData, params }) => {
    const organization = loaderData?.organization;
    const publishedJobs = organization?.jobs ?? [];
    const jobsLabel =
      publishedJobs.length === 1
        ? "1 open role"
        : `${publishedJobs.length} open roles`;

    const description = organization
      ? metaDescription(
          organization.description ||
            `Explore ${jobsLabel} at ${organization.name}. View current openings, learn about the team, and apply online.`,
        )
      : "Explore current open roles and apply online.";

    return buildSeo({
      title: organization ? `${organization.name} Careers` : "Careers",
      description,
      path: `/view/${params.slug}`,
      jsonLd: organization
        ? [
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${organization.name} Careers`,
              description,
              url: `https://lunics.co/view/${params.slug}`,
              mainEntity: {
                "@type": "ItemList",
                numberOfItems: publishedJobs.length,
                itemListElement: publishedJobs.slice(0, 20).map((job, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: job.title,
                  url: `https://lunics.co/view/${params.slug}/${job.id}`,
                })),
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: organization.name,
              url: organization.website || `https://lunics.co/view/${params.slug}`,
              description,
            },
          ]
        : undefined,
    });
  },
});

const EMPLOYMENT_TYPES = [
  { value: "FULLTIME", label: "Full-time" },
  { value: "PARTTIME", label: "Part-time" },
  { value: "FULLTIME_PARTTIME", label: "Full-time or Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CONTRACT", label: "Contract" },
] as const;

const LOCATION_MODES = [
  { value: "REMOTE", label: "Remote" },
  { value: "ONSITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

function FilterSelect({
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
    <Select
      value={selected ?? "__all__"}
      onValueChange={(value) => onSelect(value === "__all__" ? null : value)}
    >
      <SelectTrigger className="w-full font-semibold">
        <SelectValue>{selectedLabel ?? label}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        <SelectItem className="font-semibold" value="__all__">
          All
        </SelectItem>
        {options.map((option) => (
          <SelectItem
            className="font-semibold"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RouteComponent() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(viewOrganizationBySlugQueryOptions(slug));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  if (!data.organization) return <Navigate to="/" />;

  const jobs = data.organization.jobs || [];
  const categories = data.organization.categories || [];
  const offices = Array.from(
    new Map(
      jobs
        .filter((job) => job.office)
        .map((job) => [job.office!.id, job.office!]),
    ).values(),
  );

  // Get all category IDs for filtering
  const categoryIds = new Set(categories.map((c) => c.id));

  // Apply employment type and location filters to a job list
  const applyFilters = <T extends (typeof jobs)[number]>(jobList: T[]) =>
    jobList.filter((job) => {
      if (selectedType) {
        const matchesType =
          job.type === selectedType ||
          ((selectedType === "FULLTIME" || selectedType === "PARTTIME") &&
            job.type === "FULLTIME_PARTTIME") ||
          (selectedType === "FULLTIME_PARTTIME" &&
            (job.type === "FULLTIME" || job.type === "PARTTIME"));

        if (!matchesType) return false;
      }
      if (selectedLocation && job.locationMode !== selectedLocation)
        return false;
      if (selectedOffice && job.officeId !== selectedOffice) return false;
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

  const hasActiveFilters =
    selectedCategory || selectedType || selectedLocation || selectedOffice;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-full">
      <div className="w-full space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold leading-none">
              Open Roles ({visibleCount})
            </h2>
          </div>

          <div className="flex sm:flex-row flex-col gap-2">
            <div className="flex-1">
              <FilterSelect
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
              <FilterSelect
                label="Employment Type"
                options={EMPLOYMENT_TYPES}
                selected={selectedType}
                onSelect={setSelectedType}
              />
            </div>
            <div className="flex-1">
              <FilterSelect
                label="Location"
                options={LOCATION_MODES}
                selected={selectedLocation}
                onSelect={setSelectedLocation}
              />
            </div>
            <div className="flex-1">
              <FilterSelect
                label="Office"
                options={offices.map((office) => ({
                  value: office.id,
                  label: office.name,
                }))}
                selected={selectedOffice}
                onSelect={setSelectedOffice}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCategories.map((category: CategoryWithJob) => (
            <section key={category.id} className="space-y-4">
              <h3 className="text-xl font-semibold">{category.name}</h3>
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
              <h3 className="text-xl font-bold">
                {filteredCategories.length > 0 ? "Other Openings" : "Openings"}
              </h3>
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
