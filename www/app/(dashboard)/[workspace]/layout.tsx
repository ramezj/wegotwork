import LayoutNavigation from "@/components/layout/dashboard-layout";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { ReactNode } from "react";

export default async function DashboardLayout({ children, params }: { children: ReactNode, params: { workspace: string}}) {
    const session:Session | null = await auth();
    return (
        <>
        <LayoutNavigation session={session!} params={await(params)}>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
        </LayoutNavigation>
        </>
    )
}