import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Navbar } from "@/components/navbar-2";
import Link from "next/link";
import { Metadata } from "next";
import { LandingPageJobCard } from "@/components/cards/job";
import FeatureCards from "@/components/test-cards";
import { CustomButton } from "@/components/ui/custom-buttons";
import Marquee from "@/components/ui/marquee";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, FileText, Building2, Users, ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata:Metadata = {
  title: "WeGotWork — Build Beautiful Career Pages",
  description: "Build Beautiful Career Pages, Post Job Openings, Receive Applicants, All in one place."
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const items = ['wegotwork', 'start hiring', 'wegotwork', 'start hiring', 'wegotwork', 'start hiring', 'wegotwork', 'start hiring', 'wegotwork']
  return (
    <main className="">
      <Navbar session={session}/>
      <div>
      <div className="flex flex-col items-center text-center mt-12 px-2">
        {/* <div className="mb-8">
          <Button variant={"outline"} className="border border-dashed rounded-none bg-theme w-full">
          WeGotWork is now live on ProductHunt
          <ArrowUpRight className="size-4 text-white" />
          </Button>
        </div> */}
      <div className="lg:w-[60%] w-full">
        <h1 className="text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-medium leading-tight text-white">
        Build Beautiful Career Pages
      </h1>
      <h3 className="text-[1rem] mt-2 font-medium text-balance text-muted-foreground">
        Create stunning career pages, post jobs, manage applicants — all from one, easy-to-use platform.
      </h3>
      </div>
      </div>
      <div className="flex flex-col items-center p-4 -mt-4">
      <div className="flex flex-row w-full lg:w-[60%] items-center justify-center content-center gap-4 mt-6">
            <Button variant={"outline"} asChild className="px-4 w-full rounded-none font-medium border-dashed bg-theme">
              <Link href={`http://demo.${process.env.NEXT_PUBLIC_URL}`} target="_blank">
              See Demo
              </Link>
            </Button>
            <Button asChild variant={"default"} className="px-4 bg-blueColor text-white hover:bg-blueColor w-full rounded-none font-medium">
              <Link href='/auth'>
              Start Hiring
              <ArrowRight className="size-4 text-white" />
              </Link>
            </Button>
      </div>
      <div className="not-prose my-8 lg:w-[60%] w-full space-y-4">
            <LandingPageJobCard title="Operations Manager" type="Full-Time" location="Cairo, EG" age="about 1 month ago" category="Operations" />
            <LandingPageJobCard title="Financial Advisor" type="Part-Time" location="Cairo, EG" age="about 1 month ago" category="Finance" />
      </div>
      </div>
      {/* <div className="pb-5">
      <Marquee items={items} />
      </div> */}

      {/* <div className="content-center items-center justify-center flex px-4">
      <div className="not-prose lg:w-1/2 w-full overflow-hidden space-y-4">
      <FeatureCards />
      </div>
      </div> */}
      </div>
            <section className="py-[1.20rem] px-4">
        <div className="w-full lg:w-[60%] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium">Everything you need to start hiring</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-theme border border-dashed rounded-none">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white font-medium !mb-2">Beautiful Career Pages</CardTitle>
                <CardDescription className="text-gray-400 font-medium">
                  Create stunning, branded career pages that showcase your company culture and attract top talent.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-theme border border-dashed rounded-none">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white font-medium !mb-2">Easy Job Posting</CardTitle>
                <CardDescription className="text-gray-400 font-medium">
                  Post jobs in minutes with our intuitive editor. Add requirements, benefits, and company info
                  effortlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-theme border border-dashed rounded-none">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white font-medium !mb-2">Applicant Management</CardTitle>
                <CardDescription className="text-white font-medium">
                  Track, review, and manage all applications in one place. Collaborate with your team seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-theme border border-dashed rounded-none">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white font-medium !mb-2">Analytics & Insights</CardTitle>
                <CardDescription className="text-gray-400 font-medium">
                  Get detailed analytics on job performance, application rates, and hiring metrics.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
