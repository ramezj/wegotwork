import { FindOrganization } from "@/actions/organization/find-organization";
import { notFound } from "next/navigation";
import { ViewOrganization } from "@/components/view-organization";
import { Organization, Prisma } from "@prisma/client";
import { CareerNavbar } from "@/components/career-navbar";
import { Metadata } from "next";
import { Careers4 } from "./view-jobs";
import { ViewJobs2 } from "./view-jobs-2";

type JobWithCategories = Prisma.JobGetPayload<{
  include: {
    category: true;
  };
}>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ organization: string }>;
}): Promise<Metadata> {
  const organization = await FindOrganization((await params).organization);
  if (organization.error) {
    return {
      title: "404 Not Found",
    };
  }
  return {
    title: organization.organization?.name,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ organization: string }>;
}) {
  type OrganizationWithJobs = Prisma.OrganizationGetPayload<{
    include: {
      categories: {
        include: {
          jobs: {
            include: {
              category: true;
            };
          };
        };
      };
      jobs: {
        include: {
          category: true;
        };
      };
    };
  }>;
  const organization = await FindOrganization((await params).organization);
  if (organization.error) {
    notFound();
  }
  return (
    <>
      <CareerNavbar
        organization={organization.organization as OrganizationWithJobs}
      />
      {/* <ViewOrganization 
        organization={organization.organization as OrganizationWithJobs} 
        locations={organization.locations as Array<string>} 
        types={organization.types as Array<string>} /> */}
      {/* <div className="px-4">
            <Careers4 
                organization={organization.organization as OrganizationWithJobs}
                locations={organization.locations as Array<string>}
                types={organization.types as Array<string>}
            />
        </div> */}
      <ViewJobs2
        organization={organization.organization as OrganizationWithJobs}
        locations={organization.locations as Array<string>}
        types={organization.types as Array<string>}
      />
    </>
  );
}
