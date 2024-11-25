import LayoutNavigation from "@/components/layout/dashboard";
import { auth } from "@/auth";
import { Session } from "next-auth";

export default async function DashboardLayout({ children, params }: any) {
    const session:Session | null = await auth();
    return (
        <>
        <LayoutNavigation session={session!}>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
        </LayoutNavigation>
        </>
    )
}