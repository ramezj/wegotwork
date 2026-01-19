import { createFileRoute } from "@tanstack/react-router";
import { getServerSession } from "@/lib/get-server-session";
import Header from "@/components/common/header";

export const Route = createFileRoute("/")({
  component: App,
  beforeLoad: async () => {
    const session = await getServerSession();
    return { session };
  },
});

function App() {
  const { session } = Route.useRouteContext();
  console.log(session);
  return (
    <>
      <Header session={session} />
      {/* {session?.user ? <LogOutButton /> : <LoginButton />} */}
    </>
  );
}
