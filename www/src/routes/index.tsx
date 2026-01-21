import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/shared/header";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <div>
      <Header session={session} isPending={isPending} />
    </div>
  );
}
