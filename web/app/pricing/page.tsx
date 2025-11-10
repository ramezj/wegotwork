import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navigation } from "@/components/navbar";
import { Navbar } from "@/components/navbar-2";
import SignIn from "@/components/sign-in";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FreeCard, PaidCard } from "@/components/pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pricing",
};

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <>
      <Navbar session={session} />
      <div className="flex items-center justify-center p-8">
        <h1 className="font-medium text-4xl text-white">Pricing</h1>
      </div>
      <div className="flex sm:flex-row flex-col gap-4 items-center justify-center">
        <FreeCard />
        <PaidCard />
      </div>
    </>
  );
}
