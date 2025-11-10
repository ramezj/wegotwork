import LayoutNavigation from "@/components/layout";
import { auth } from "@/lib/auth";
import { Session } from "@/lib/auth-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ organization: string }>;
}) {
  const session: Session | null = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/");
  }
  if (session.user.currentOrganizationId === null) {
    redirect("/dashboard");
  }
  return (
    <>
      <LayoutNavigation
        session={session!}
        organization={session.user.currentOrganizationId!}
      >
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </LayoutNavigation>
    </>
  );
}
