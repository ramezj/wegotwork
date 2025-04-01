"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { SetCurrentOrganization } from "@/actions/organization/set-current-org"
import { Organization, OrganizationUser } from "@prisma/client"
import { Prisma } from "@prisma/client"
import { Button } from "./ui/button"
import Link from "next/link"
import { useState } from "react"
import { CreateOrganizationButton } from "./create-organization"
import { toast } from "sonner"
import { redirect } from "next/navigation"

type OrganizationUserWithOrganization = Prisma.OrganizationUserGetPayload<{
    include: {
        organization: true
    }
}>


export function TestSetOrganizationCard({ userOrganizations }: { userOrganizations : OrganizationUserWithOrganization[] }) {
    const setUserOrg = async (organizationId: string) => {
        const res = await SetCurrentOrganization(organizationId);
        if(res?.error ) {
            toast(res.message);
        } else {
            setTimeout(() => {
                redirect('/overview')
            }, 1000);
        }
    }
    return (
    <Card className="w-[350px] bg-white border rounded-none">
    <CardHeader className="text-center">
            <CardTitle className="text-black font-extrabold">
                Organizations
            </CardTitle>
        <CardDescription className="text-black font-bold">
            Organizations you own or are a part of
        </CardDescription>
    </CardHeader>
    <CardContent>
        <div className="grid w-full items-center">
        <div className="flex flex-col">
        {
            userOrganizations.map((organization: OrganizationUserWithOrganization) => {
            return (
                <div key={organization.organizationId}>
                <Button onClick={(() => {setUserOrg(organization.organizationId)})} variant={"outline"} className="my-2 w-full flex flex-col items-start text-left !rounded-none bg-white hover:bg-white border border-black text-black hover:text-black font-extrabold">           
                {organization.organization.name}    
                </Button>
                </div>
                    )
                })
            }
            </div>
        </div>
    </CardContent>
    <CardFooter className="flex flex-col space-y-2 justify-between">
              <CreateOrganizationButton />
    </CardFooter>
    </Card>
    )
}