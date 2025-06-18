import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserOrganizations } from "@/actions/organization/user-organizations";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { Navbar } from "@/components/navbar-2";
import { Metadata } from "next";
import { TestSetOrganizationCard } from "@/components/test-set-org";
import { OrganizationSelector } from "@/components/organization-selector";
import { PickOrganizationCard } from "@/components/pick-organization";

type OrganizationUserWithOrganization = Prisma.OrganizationUserGetPayload<{
    include: {
        organization: true
    }
}>

export const metadata:Metadata = {
  title: "Choose Organization",
  description: "Choose Organization"
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(!session?.user) { redirect('/auth') }
  const Organizations = await UserOrganizations();
  return (
    <>
    <Navbar session={session} />
    <div className="mt-20 flex justify-center items-center content-center">
    <PickOrganizationCard userOrganizations={Organizations?.userOrganizations as OrganizationUserWithOrganization[]} />
    </div>
    </>
  );
}
