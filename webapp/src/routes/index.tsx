import LoginButton, { LogOutButton } from "@/components/auth/login-button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <LoginButton />
      <LogOutButton />
    </>
  );
}
