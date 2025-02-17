
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navigation } from "@/components/navbar";
import { UserOrganizations } from "@/actions/organization/user-organizations";
import { redirect } from "next/navigation";
import { CreateOrganizationButton } from "@/components/create-organization";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Prisma } from "@prisma/client";

type OrganizationUserWithOrganization = Prisma.OrganizationUserGetPayload<{
    include: {
        organization: true
    }
}>

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if(!session?.user) { redirect('/auth') }
  const Organizations = await UserOrganizations();
  return (
    <>
    <Navigation session={session} />
    <div className="flex items-center justify-center mt-12">
        <h1 className="font-bold text-3xl">Pick an Organization</h1>
        </div>
        <div className="w-full flex items-center justify-center mt-8">
        <Card className="w-[350px] bg-background">
        <CardHeader className="text-center">
        <CardTitle>Organizations</CardTitle>
        <CardDescription>Organizations you own or are a part of</CardDescription>
        </CardHeader>
        <CardContent>
        <form>
          <div className="grid w-full items-center">
            <div className="flex flex-col">
            {
                Organizations?.userOrganizations?.map((organization: OrganizationUserWithOrganization) => {
                    return (
                        <div key={organization.id}>
                        <Button asChild variant={"outline"} className="my-2 flex flex-col items-start text-left">
                        <Link href={`${organization.id}/overview`} className="" key={organization.id}>
                        {organization.organization.name}    
                        </Link> 
                        </Button>
                        </div>
                    )
                })
            }
            </div>
          </div>
        </form>
      </CardContent>
        <CardFooter className="flex flex-col space-y-2 justify-between">
          <CreateOrganizationButton />
        </CardFooter>
        </Card>
        </div>
    </>
  );
}
