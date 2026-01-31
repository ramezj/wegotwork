import { createFileRoute } from "@tanstack/react-router";
import { getSession } from "@/features/auth/server-session";
import Header from "@/components/shared/header";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getSession();
    return { session };
  },
  component: App,
});

function App() {
  const { session } = Route.useRouteContext();
  return (
    <div>
      <Header session={session} />
    </div>
  );
}
