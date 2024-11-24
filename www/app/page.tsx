"use server"
import { Button } from "@/components/ui/button";
import { LoginButton, LogOutButton } from "@/components/login-button";
import Link from "next/link";
import { Navigation } from "@/components/layout/navigation-bar";

export default async function Home() {
  return (
    <main>
      <Navigation />
      <LoginButton />
      <Button asChild>
        <Link href="/dashboard">
        Dashboard
        </Link>
      </Button>
      <LogOutButton />
    </main>
  );
}
