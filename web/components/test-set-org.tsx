"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { SetCurrentOrganization } from "@/actions/organization/set-current-org"
import { Prisma } from "@prisma/client"
import { Button } from "./ui/button"
import { CreateOrganizationButton } from "./create-organization"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

type OrganizationUserWithOrganization = Prisma.OrganizationUserGetPayload<{
    include: {
        organization: true
    }
}>


export function TestSetOrganizationCard({ userOrganizations }: { userOrganizations : OrganizationUserWithOrganization[] }) {
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
    const [isSelecting, setIsSelecting] = useState(false)
    const setUserOrg = async (e:React.FormEvent, organizationId: string) => {
        e.preventDefault();
        setSelectedOrgId(organizationId)
        setIsSelecting(true)
        const res = await SetCurrentOrganization(organizationId);
        if(res?.error ) {
            toast(res.message);
            setIsSelecting(false);
        } else {
            redirect('/overview');
        }
    }
    return (
    <Card className="w-[350px] bg-white rounded-none border-black border-[3px] shadow-[0_4px_0_0_rgba(0,0,0,1)]">
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
                <form className="" onSubmit={((e) => {setUserOrg(e, organization.organizationId)})} key={organization.organizationId}>
                <Button type="submit" variant={"outline"} 
                className={`my-2 w-full !rounded-none ${selectedOrgId === organization.organizationId 
                    ? 
                    "bg-white text-black hover:bg-white hover:text-black" 
                    : 
                    "bg-white hover:bg-white text-black hover:text-black"} 
                    font-extrabold border-[3px] border-black duration-200 transition-all shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] active:translate-y-1`}
                >           
                {
                    (organization.organizationId === selectedOrgId && isSelecting)
                    ? 
                    <>
                    <Loader2 className={`animate-spin ${selectedOrgId === organization.organizationId ? "text-black" : "text-black"} flex`} />
                    {organization.organization.name}  
                    </>
                    :
                    <>
                    {organization.organization.name}  
                    </>
                } 
                </Button>
                </form>
                    )
                })
            }
            </div>
        </div>
    </CardContent>
    <CardFooter className="flex flex-col space-y-2 -mt-2 justify-between">
              <CreateOrganizationButton />
    </CardFooter>
    </Card>
    // <div className="flex gap-4">
    // {
    //     userOrganizations.map((organization: OrganizationUserWithOrganization) => {
    //         return (
    //             <Card onClick={(() => {setUserOrg(organization.organizationId)})} key={organization.organizationId} className="rounded-none bg-white text-black border border-black cursor-pointer">
    //                 <CardHeader>
    //                     <CardTitle>{organization.organization.name}</CardTitle>
    //                 </CardHeader>
    //                 <CardContent>
    //                     {organization.organization.description}
    //                 </CardContent>
    //             </Card>
    //         )
    //     })
    // }
    // </div>
    )
}