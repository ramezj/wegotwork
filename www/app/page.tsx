"use server"
import { Navigation } from "@/components/layout/navigation-bar";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@/auth";
import { Session } from "next-auth";

export default async function Home() {
  const session:Session | null = await auth();
  
  return (
    <main>
      <Navigation session={session} />
      <div className="flex flex-col items-center text-center pt-12">
      <Button className="font-semibold mb-6 w-fit bg-inherit px-16" size={"sm"} variant={"outline"}>
      Introducing heliup <ArrowUpRight className="w-4 ml-2" />
      </Button>
      </div>
      <div>
      <div className="flex flex-col items-center text-center">
      <h1 className="sm:text-6xl text-4xl font-medium">
        Build Career Pages Effortlessly
      </h1>
      <h3 className="sm:text-lg text-sm mt-2 font-thin text-balance">
        Build career pages, create jobs, receive applicants & start the hiring process. All in one place.
      </h3>
      </div>
      <div className="flex flex-col items-center p-4 -mt-4">
      <div className="flex flex-row w-full max-w-fit items-center justify-center content-center gap-4 mt-6">
            <Button variant={"default"} className="font-semibold w-60 rounded-md text-background">
                {/* <Link href='/auth'> */}
                Start Hiring
                {/* </Link> */}
            </Button>
            <Button className="font-medium bg-inherit w-60 border-foreground/20 rounded-md" variant={"outline"}>
                {/* <Link href="https://demo.heliup.xyz" target="_blank"> */}
                See Demo
                <ArrowUpRight className="w-4 ml-2" />
                {/* </Link> */}
                </Button>
      </div>
      </div>
      </div>
    </main>
  );
}
