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
import { BarChart3, FileText, Building2, Users, ArrowRight } from "lucide-react";

export const metadata:Metadata = {
  title: "wegotwork",
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
      <h1 className="md:text-7xl text-5xl font-medium text-white">
        {/* Hiring just got easier. */}
        Build Beautiful Career Pages
      </h1>
      <h3 className="sm:text-lg text-sm mt-2 font-medium text-balance text-white">
        Build beautiful career pages, create jobs, receive applicants, all in one place.
      </h3>
      </div>
      <div className="flex flex-col items-center p-4 -mt-4">
      <div className="flex flex-row w-full lg:w-[60%] items-center justify-center content-center gap-4 mt-6">
            {/* <CustomButton asChild variant={"default"} className="font-medium w-full rounded-none bg-white text-black border-2 border-black hover:bg-white transition-all hover:shadow-[0_0px_0_0_rgba(0,0,0,1)] hover:translate-y-1">
                <Link href='/auth'>
                Start Hiring
                </Link>
            </CustomButton> */}
            <Button asChild variant={"outline"} className="px-4 bg-theme w-full rounded-none font-medium">
              <Link href='/auth'>
              Start Hiring
              </Link>
              </Button>
            <Button variant={"default"} asChild className="px-4 w-full rounded-none font-medium">
              <Link href={`http://demo.${process.env.NEXT_PUBLIC_URL}`} target="_blank">
              See Demo
              </Link>
            </Button>
            {/* <CustomButton asChild className="font-medium w-full rounded-none bg-white text-black border-2 border-black hover:bg-white transition-all hover:shadow-[0_0px_0_0_rgba(0,0,0,1)] hover:translate-y-1" variant={"default"}>
                <Link target="_blank" href={`http://demo.${process.env.NEXT_PUBLIC_URL}`}>
                See Demo
                </Link>
            </CustomButton> */}
      </div>
      <div className="not-prose my-8 lg:w-[60%] w-full space-y-4">
            <LandingPageJobCard title="Operations Manager" type="Full-Time" location="Cairo, EG" age="about 1 month ago" category="Operations" />
            <LandingPageJobCard title="Financial Advisor" type="Part-Time" location="Cairo, EG" age="about 1 month ago" category="Finance" />
      </div>
      </div>
      {/* <div className="not-prose my-8 lg:w-1/2 w-full space-y-4 border border-white/20 flex items-center content-center">
        <img
        className="border-2 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]"
        src="/dashboard.png"
        alt="Photo by Drew Beamer"
        />
      </div> */}
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
            <Card className="bg-theme border rounded-none">
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

            <Card className="bg-theme border rounded-none">
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

            <Card className="bg-theme border rounded-none">
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

            <Card className="bg-theme border rounded-none">
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
