import { createFileRoute } from "@tanstack/react-router";
import { getServerSession } from "@/lib/get-server-session";

export const Route = createFileRoute("/(core)/_layout/dash")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getServerSession();
    return { session };
  },
  loader: async ({ context }) => {
    return { session: context.session };
  },
});

function RouteComponent() {
  const { session } = Route.useLoaderData();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <p className="text-xl mb-4">
          Welcome,{" "}
          <span className="text-cyan-400 font-semibold">
            {session?.user.name}
          </span>
          !
        </p>
        <div className="space-y-2">
          <p className="text-gray-400 font-mono text-sm">Session Data:</p>
          <pre className="bg-slate-900 p-4 rounded-lg overflow-auto max-h-96 text-xs text-cyan-300">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
