import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { UserOrganizations } from "@/actions/organization/user-organizations";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { Navbar } from "@/components/navbar-2";
import { Metadata } from "next";
import { TestSetOrganizationCard } from "@/components/test-set-org";
import { OrganizationSelector } from "@/components/organization-selector";

type OrganizationUserWithOrganization = Prisma.OrganizationUserGetPayload<{
    include: {
        organization: true
    }
}>

export const metadata:Metadata = {
  title: "dashboard",
  description: "dashboard"
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
    <div className="flex items-center justify-center mt-12">
    <h1 className="font-extrabold text-3xl text-black">Pick an organization</h1>
    </div>
    <div className="mt-8 flex justify-center items-center content-center">
    <TestSetOrganizationCard userOrganizations={Organizations?.userOrganizations as OrganizationUserWithOrganization[]} />
    </div>
    </>
  );
}
