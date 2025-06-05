import { GetOrganization } from "@/actions/organization/organization"
import { auth } from "@/lib/auth"
import { Session } from "@/lib/auth-client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { BillingCard } from "@/components/billing"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Banknote } from "lucide-react"

export const metadata:Metadata = {
    title: "billing",
    description: "billing"
}

export default async function Page({ params } : { params: Promise<{ organization: string }>}) {
    const session:Session | null = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        redirect('/');
    }
    if(session.user.currentOrganizationId === null) {
        redirect('/dashboard');
    }
    const userOrganization = await GetOrganization(session.user.currentOrganizationId!);
    if(userOrganization?.error) {
        redirect('/');
    }
    if(userOrganization?.organization?.role === 'member') {
        return (
            <>
            <div className="flex justify-between items-center w-full">
            <h1 className="font-extrabold text-white text-4xl tracking-tight">Billing</h1>
            <Button size={"sm"} className="rounded-none font-extrabold border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] active:shadow-[0_0px_0_0_rgba(0,0,0,1)] active:translate-y-1 transition-all">
                <Banknote className="size-4" />
            </Button>
            </div>
            <p>Unauthorized</p>
            </>
        )
    }
    return (
        <>
        <div className="flex justify-between items-center w-full">
        <h1 className="font-extrabold text-white text-4xl tracking-tight">Billing</h1>
        <Button size={"sm"} variant={"outline"} className=" bg-theme font-extrabold border border-white/20">
            <Banknote className="size-4" />
        </Button>
        </div>
        <BillingCard />
        {/* {JSON.stringify(userOrganization?.organization)} */}
        </>
    )
}