
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navigation } from "@/components/navbar";
import { Navbar } from "@/components/navbar-2";
import SignIn from "@/components/sign-in";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Login to wegotwork",
  description: "Login to wegotwork."
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return (
    <>
    <Navbar session={session} />
    <div className="flex items-center justify-center py-24">
        <SignIn />
    </div>
    </>
  );
}
