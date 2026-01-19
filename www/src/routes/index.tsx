import { createFileRoute } from "@tanstack/react-router";
import BetterAuthHeader from "@/integrations/better-auth/header-user";
import { SignInButton } from "@/components/auth/auth-buttons";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div>
      <BetterAuthHeader />
      <SignInButton />
    </div>
  );
}
