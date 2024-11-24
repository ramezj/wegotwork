"use server"
import { Button } from "@/components/ui/button";
import { LoginButton, LogOutButton } from "@/components/login-button";
import Link from "next/link";
import { Navigation } from "@/components/layout/navigation-bar";
import { auth } from "@/auth";
import { Session } from "next-auth";

export default async function Home() {
  const session:Session | null = await auth();
  return (
    <main>
      <Navigation session={session} />
    </main>
  );
}
