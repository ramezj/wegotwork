import { GetOrganization } from "@/actions/organization/organization"
import { auth } from "@/lib/auth"
import { Session } from "@/lib/auth-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SquareArrowOutUpRight } from "lucide-react"
import { TotalJobs, TotalApplicants } from "@/components/statistics"
import { Metadata } from "next"
import { SettingsCard } from "@/components/cards/settings"
import { Organization } from "@prisma/client"
import { CustomButton } from "@/components/ui/custom-buttons"

export const metadata:Metadata = {
    title: "Overview",
    description: "overview"
}

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session?.user) { 
        redirect('/')
    }
    if(session.user.currentOrganizationId === null) {
        redirect('/dashboard')
    }
    const userOrganization = await GetOrganization(session.user.currentOrganizationId!);
    if(userOrganization?.error) {
        redirect('/');
    }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-extrabold text-4xl tracking-tight text-white">Overview</h1>
        <Button asChild variant={"outline"} className="bg-theme px-4">
            <Link target="_blank" href={`http://${userOrganization?.organization?.organization.slug}.${process.env.NEXT_PUBLIC_URL}`}>
            Preview
            <SquareArrowOutUpRight className="size-4" />
            </Link>
        </Button>
        </div>
        <div className="flex sm:flex-row flex-col gap-4 w-full">
        <TotalJobs title="Jobs" amount={userOrganization?.organization?.organization.jobs.length as number}/>
        <TotalApplicants title="Applicants" amount={userOrganization?.applicants as number}/>
        <TotalApplicants title="Categories" amount={userOrganization?.organization?.organization.categories.length as number}/>
        </div>
        <SettingsCard organization={userOrganization?.organization?.organization as Organization} />
        </>
    )
}