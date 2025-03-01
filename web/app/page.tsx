import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navigation } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/navbar-2";
import Link from "next/link";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: "heliup, hiring just got easier.",
  description: "hiring just got easier."
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  return (
    <main className="">
      <Navbar session={session}/>
      <div>
      <div className="flex flex-col items-center text-center mt-24">
      <h1 className="sm:text-6xl text-4xl font-extrabold text-black">
        hiring just got easier.
      </h1>
      <h3 className="sm:text-lg text-sm mt-2 font-medium text-balance text-black">
        build career pages, create jobs, receive applicants & start the hiring process. all in one place.
      </h3>
      </div>
      <div className="flex flex-col items-center p-4 -mt-4">
      <div className="flex flex-row w-full max-w-fit items-center justify-center content-center gap-4 mt-6">
            <Button variant={"default"} className="font-extrabold w-60 rounded-md text-background">
                start hiring
            </Button>
            <Button className="font-extrabold w-60 bg-black text-white" variant={"default"}>
                see demo
                <ArrowUpRight className="w-4 ml-2" />
            </Button>
      </div>
      </div>
      </div>
    </main>
  );
}
