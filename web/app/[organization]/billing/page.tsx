import { GetOrganization } from "@/actions/organization/organization"
import { auth } from "@/lib/auth"
import { Session } from "@/lib/auth-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

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
    return (
        <>
        <h1 className="font-bold text-3xl tracking-tight">Billing</h1>
        </>
    )
}