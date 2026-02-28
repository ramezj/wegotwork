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
      <div className="lg:w-[70%] w-full mx-auto sticky top-5 z-50 px-4">
        <Header session={session} />
      </div>
      <main className="flex flex-1 flex-col lg:w-[70%] mx-auto w-full px-4">
        <Suspense fallback={<LoadingLayout title="" />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
