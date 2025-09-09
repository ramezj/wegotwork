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
import Image from "next/image";
import { HeroHeader } from "@/components/header";

export const metadata: Metadata = {
  title: "WeGotWork - Build Beautiful Career Pages & Hire Top Talent",
  description: "Create stunning career pages, post job openings, and manage applicants with WeGotWork's all-in-one hiring platform. Start hiring top talent today with our easy-to-use recruitment tools.",
  keywords: [
    "career pages", "job posting platform", "applicant tracking system", "hiring software", 
    "recruitment platform", "talent acquisition", "HR tools", "job board", "hiring manager",
    "candidate management", "employment platform", "recruiting software", "WeGotWork"
  ],
  authors: [{ name: "WeGotWork Team" }],
  creator: "WeGotWork",
  publisher: "WeGotWork",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://wegotwork.co",
  },
  openGraph: {
    title: "WeGotWork - Build Beautiful Career Pages & Hire Top Talent",
    description: "Create stunning career pages, post job openings, and manage applicants with WeGotWork's all-in-one hiring platform. Start hiring top talent today.",
    url: "https://wegotwork.co",
    siteName: "WeGotWork",
    images: [
      {
        url: "https://wegotwork.co/homepage.png",
        width: 1200,
        height: 630,
        alt: "WeGotWork - Build Beautiful Career Pages & Hire Top Talent"
      }
    ],
    type: "website",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "WeGotWork - Build Beautiful Career Pages & Hire Top Talent",
    description: "Create stunning career pages, post job openings, and manage applicants with WeGotWork's all-in-one hiring platform.",
    images: ["https://wegotwork.co/homepage.png"],
    creator: "@wegotwork",
    site: "@wegotwork"
  },
  category: "Business Software",
  classification: "Hiring Platform",
}

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const items = ['wegotwork', 'start hiring', 'wegotwork', 'start hiring', 'wegotwork', 'start hiring', 'wegotwork', 'start hiring', 'wegotwork']
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "WeGotWork",
    "description": "Create stunning career pages, post job openings, and manage applicants with WeGotWork's all-in-one hiring platform.",
    "url": "https://wegotwork.co",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free trial available"
    },
    "provider": {
      "@type": "Organization",
      "name": "WeGotWork",
      "url": "https://wegotwork.co",
      "logo": "https://wegotwork.co/logo.png",
      "sameAs": [
        "https://twitter.co/wegotwork",
        "https://linkedin.co/company/wegotwork"
      ]
    },
    "featureList": [
      "Beautiful Career Pages",
      "Easy Job Posting",
      "Applicant Management", 
      "Analytics & Insights"
    ],
    "screenshot": "https://wegotwork.co/demo.png"
  }

  return (
    <main className="">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar session={session}/>
      <header>
      <section className="flex flex-col items-center text-center mt-12 px-2">
      <div className="lg:w-[60%] w-full">
        <h1 className="text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-bold leading-tight text-white">
        Build Beautiful Career Pages
      </h1>
        <p className="text-[1rem] mt-2 font-extrabold text-balance text-muted-foreground">
        Create stunning career pages, post jobs, manage applicants — all from one, easy-to-use platform.
        </p>
      </div>
      </section>
      <div className="flex flex-col items-center p-4 -mt-4">
      <div className="flex flex-row w-full lg:w-[60%] items-center justify-center content-center gap-4 mt-6">
            <Button variant={"outline"} asChild className="px-4 w-full rounded-none font-bold border-dashed bg-theme">
              <Link href={`http://demo.${process.env.NEXT_PUBLIC_URL}`} target="_blank">
              See Demo
              </Link>
            </Button>
            <Button asChild variant={"default"} className="px-4 bg-white text-black hover:bg-white w-full rounded-none font-bold">
              <Link href='/auth'>
              Start Hiring
              {/* <ArrowUpRight className="size-4 text-black" /> */}
              </Link>
            </Button>
      </div>
      <div className="not-prose my-8 lg:w-[60%] w-full space-y-4">
            <LandingPageJobCard title="Operations Manager" type="Full-Time" location="Cairo, EG" age="about 1 month ago" category="Operations" />
            <LandingPageJobCard title="Financial Advisor" type="Part-Time" location="Brussels, EG" age="about 1 month ago" category="Finance" />
            <div className="hidden 2xl:block">
            <LandingPageJobCard title="Software Engineer" type="Full-Time" location="Berlin, Germany" age="about 1 month ago" category="Finance" />
            </div>
      </div>
      </div>
      </header>
            <section className="py-[1.20rem] px-4">
        <div className="w-full lg:w-[60%] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Everything you need to start hiring.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-theme border border-dashed rounded-none">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white font-medium !mb-2 text-foreground">Beautiful Career Pages</CardTitle>
                <CardDescription className="text-muted-foreground font-medium text-foreground">
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
                <CardDescription className="text-muted-foreground font-medium">
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
                <CardDescription className="text-muted-foreground font-medium">
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
