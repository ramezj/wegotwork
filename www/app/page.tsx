"use server"
import { Navigation } from "@/components/layout/navigation-bar";
import { auth } from "@/auth";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export default async function Home() {
  const session:Session | null = await auth();
  return (
    <main>
      <Navigation session={session} />
      <div className="flex flex-col items-center text-center pt-12">
      <Button className="mb-6 w-fit bg-inherit px-16 rounded-none bg-greenish text-background hover:bg-greenish hover:text-background border-none" size={"sm"} variant={"outline"}>
      Introducing heliup <ArrowUpRight className="w-4 ml-2" />
      </Button>
      </div>
      <div>
      <div className="flex flex-col items-center text-center">
      <h1 className="sm:text-6xl text-4xl font-light text-greenish">
              Build Career Pages Effortlessly.
      </h1>
      </div>
      </div>
    </main>
  );
}
