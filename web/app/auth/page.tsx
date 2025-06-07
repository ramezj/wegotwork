
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navigation } from "@/components/navbar";
import { Navbar } from "@/components/navbar-2";
import SignIn from "@/components/sign-in";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "Sign In to wegotwork",
  description: "Sign In to wegotwork."
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return (
    <>
    <Navbar session={session} />
    <div className="text-center">
      <h1 className="font-bold text-white text-4xl py-8">wegotwork</h1>
    </div>
    <div className="flex items-center justify-center">
        <SignIn />
    </div>
    </>
  );
}
