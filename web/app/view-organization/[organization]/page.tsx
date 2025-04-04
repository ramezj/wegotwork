import { FindOrganization } from "@/actions/organization/find-organization";
import { notFound } from "next/navigation";
import { ViewOrganization } from "@/components/view-organization";
import { Prisma } from "@prisma/client";
import { CareerNavbar } from "@/components/career-navbar";
import { Metadata } from "next";

export async function generateMetadata({ params } : { params: Promise<{ organization: string }>}): Promise<Metadata> {
    const organization = await FindOrganization((await params).organization);
    if(organization.error) {
        return {
            title: "404 Not Found"
        }
    } 
    return {
        title: organization.organization?.name
    }
}

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    type OrganizationWithJobs = Prisma.OrganizationGetPayload<{
        include: {
            jobs: true
        }
    }>
    const organization = await FindOrganization((await params).organization);
    if(organization.error) {
        notFound();
    }
    return (
        <>
        <CareerNavbar organizationName={organization.organization?.name as string} />
        <ViewOrganization 
        organization={organization.organization as OrganizationWithJobs} 
        locations={organization.locations as Array<string>} 
        types={organization.types as Array<string>} />
        </>
    )
}