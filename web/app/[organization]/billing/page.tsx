import { GetOrganization } from "@/actions/organization/organization"
import { auth } from "@/lib/auth"
import { Session } from "@/lib/auth-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { BillingCard } from "@/components/billing"
import { Metadata } from "next"

export const metadata:Metadata = {
    title: "Billing",
    description: "Billing"
}

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        redirect('/');
    }
    const userOrganization = await GetOrganization((await params).organization);
    if(userOrganization?.error) {
        redirect('/');
    }
    if(userOrganization?.organization?.role === 'member') {
        return (
            <>
            <h1 className="font-extrabold text-4xl text-black tracking-tight">Billing</h1>
            <p>Unauthorized</p>
            </>
        )
    }
    return (
        <>
        <h1 className="font-extrabold text-4xl text-black tracking-tight">billing</h1>
        <BillingCard />
        {/* {JSON.stringify(userOrganization?.organization)} */}
        </>
    )
}