"use client";
import { useState } from "react";
import { Prisma, Type, Job } from "@prisma/client";
import { Button } from "@/components/ui/button";

type OrganizationWithJobs = Prisma.OrganizationGetPayload<{
  include: {
    categories: {
      include: {
        jobs: true;
      };
    };
    jobs: {
      include: {
        category: true;
      };
    };
  };
}>;

interface Careers4Props {
  heading?: string;
  organization: OrganizationWithJobs;
  locations: Array<string>;
  types: Array<string>;
}

const Careers4 = ({
  heading = "Job Openings",
  organization,
  locations,
  types,
}: Careers4Props) => {
  const [originalJobs] = useState<Array<Job>>(organization.jobs);
  const [jobs, setJobs] = useState<Array<Job>>(organization.jobs);
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<string>("All");

  const filterJobs = (location: string, employmentType: string) => {
    let filteredJobs = originalJobs;
    if (location !== "All") {
      filteredJobs = filteredJobs.filter((job) => job.country === location);
    }
    if (employmentType !== "All") {
      filteredJobs = filteredJobs.filter((job) => job.type === employmentType);
    }
    setJobs(filteredJobs);
  };

  const jobsByCategory = organization.categories
    .map((category) => ({
      category: category.name,
      openings: jobs
        .filter((job) => job.categoryId === category.id)
        .map((job) => ({
          title: job.title,
          location: job.country || "",
          url: `/view/${organization.slug}/${job.id}`,
        })),
    }))
    .filter((cat) => cat.openings.length > 0);

  return (
    <section className="py-12">
      <div className="w-full">
        <div className="mx-auto max-w-4xl">
          <div className="text-center lg:text-left">
            <h1 className="text-left text-3xl font-medium md:text-4xl">
              {heading}
            </h1>
          </div>
          <div className="mx-auto mt-6 flex flex-col gap-16 md:mt-14">
            {jobsByCategory.map((jobCategory) => (
              <div key={jobCategory.category} className="grid">
                <h2 className="border-b pb-4 text-xl font-bold">
                  {jobCategory.category}
                </h2>
                {jobCategory.openings.map((job) => (
                  <div
                    key={job.title}
                    className="flex items-center justify-between border-b py-4"
                  >
                    <a href={job.url} className="font-semibold hover:underline">
                      {job.title}
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      className="pointer-events-none rounded-none"
                    >
                      {job.title}
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Careers4 };
