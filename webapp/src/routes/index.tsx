import LoginButton, { LogOutButton } from "@/components/auth/login-button";
import { createFileRoute } from "@tanstack/react-router";
import { getServerSession } from "@/lib/get-server-session";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async ({ context }) => {
    const session = await getServerSession();
    return { session };
  },
});

function App() {
  const { session } = Route.useRouteContext();
  return <>{session.user ? <LogOutButton /> : <LoginButton />}</>;
}
