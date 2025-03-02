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

export const metadata:Metadata = {
    title: "Overview",
    description: "Overview"
}

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session?.user) { redirect('/') }
    const userOrganization = await GetOrganization((await params).organization);
    if(userOrganization?.error) {
        redirect('/');
    }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-extrabold text-3xl tracking-tight text-black">Overview</h1>
        <Button asChild size={"sm"} className="rounded-sm font-extrabold border border-black">
            <Link target="_blank" href={`http://${userOrganization?.organization?.organization.slug}.${process.env.NEXT_PUBLIC_URL}`}>
            Preview
            <SquareArrowOutUpRight className="size-4" />
            </Link>
        </Button>
        </div>
        <div className="flex sm:flex-row flex-col gap-2 w-full">
        <TotalJobs title="Total Jobs" amount={userOrganization?.organization?.organization.jobs.length as number}/>
        <TotalApplicants title="Total Applicants" amount={57}/>
        </div>
        <SettingsCard organization={userOrganization?.organization?.organization as Organization} />
        </>
    )
}