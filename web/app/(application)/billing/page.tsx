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
    title: "Billing",
    description: "Billing"
}

export default async function Page() {
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
            <h1 className="font-extrabold text-foreground text-3xl tracking-tight">Billing</h1>
            <Button size={"sm"} variant={"outline"} className=" dark:bg-theme bg-gray-200 font-medium border border-dashed border-foreground/20 rounded-none">
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
        <h1 className="font-extrabold text-foreground text-3xl tracking-tight">Billing</h1>
        <Button size={"sm"} variant={"outline"} className=" dark:bg-theme bg-gray-200 font-medium border border-dashed border-foreground/20 rounded-none">
            <Banknote className="size-4" />
        </Button>
        </div>
        <BillingCard />
        {/* {JSON.stringify(userOrganization?.organization)} */}
        </>
    )
}