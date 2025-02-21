import { FindOrganization } from "@/actions/organization/find-organization";
import { notFound } from "next/navigation";
import { ViewOrganization } from "@/components/view-organization";
import { Prisma } from "@prisma/client";

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
        <ViewOrganization 
        organization={organization.organization as OrganizationWithJobs} 
        locations={organization.locations as Array<string>} 
        types={organization.types as Array<string>} />
        </>
    )
}