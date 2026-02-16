import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "@/components/shared/header";
import { getSession } from "@/features/auth/server-session";
import { Suspense } from "react";
import { LoadingLayout } from "@/components/shared/layout";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  ssr: true,
  beforeLoad: async () => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/" });
    }
    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  return (
    <div className="flex flex-col min-h-screen">
      <Header session={session} />
      <main className="flex flex-1 flex-col">
        <Suspense fallback={<LoadingLayout title="" />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
