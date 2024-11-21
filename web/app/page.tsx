"use server"
import { LoginButton } from "@/components/ui/login-button";

export default async function Home() {
  return (
    <main>
      <LoginButton />
    </main>
  );
}
