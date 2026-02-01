import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/features/auth/server-session";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  FileText,
  Users,
} from "lucide-react";
import { JobCard } from "@/components/job/job-card";
import { Job } from "generated/prisma/client";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getSession();
    return { session };
  },
  component: App,
});

function App() {
  const { session } = Route.useRouteContext();
  return (
    // <div>
    //   <Header session={session} />
    //   <div className="justify-center items-center text-center content-center py-16">
    //     <h1 className="text-4xl">Career Pages, Redefined</h1>
    //     <div className="flex flex-row gap-2 justify-center items-center">
    //       <Button className="w-36">Get Started</Button>
    //       <Button variant={"outline"} className="w-36">
    //         Learn More
    //       </Button>
    //     </div>
    //     <div className="mt-8 flex justify-center">
    //       <img
    //         src="/demo.png"
    //         alt="Demo"
    //         className="lg:w-[50%] w-[80%] h-auto border-2"
    //       />
    //     </div>
    //   </div>
    // </div>
    <main className="">
      <Header session={session} />
      <header>
        <section className="flex flex-col items-center text-center mt-12 px-2">
          <div className="lg:w-[60%] w-full">
            <h1 className="text-3xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-semibold leading-tight text-white">
              Career Pages, Redefined.
            </h1>
            <p className="text-[1rem] mt-2 font-semibold text-balance text-muted-foreground">
              Create stunning career pages, post jobs, manage applicants — all
              from one, easy-to-use platform.
            </p>
          </div>
        </section>
        <div className="flex flex-col items-center p-4 -mt-4 ">
          <div className="flex flex-row w-full lg:w-[60%] items-center justify-center content-center gap-4 mt-6">
            <Button variant={"outline"} asChild className="flex-1">
              <Link to={"/"} target="_blank">
                See Demo
              </Link>
            </Button>
            <Button variant={"default"} asChild className="flex-1">
              <Link to={"/"} target="_blank">
                Start Hiring
                <ArrowUpRight />
              </Link>
            </Button>
            {/* <Button
              asChild
              variant={"default"}
              className="px-4 bg-white text-black hover:bg-white w-full rounded-none font-bold"
            >
              <Link to="/">
                Start Hiring
              </Link>
            </Button> */}
          </div>
          <div className="not-prose my-8 lg:w-[60%] w-full space-y-4">
            <div>
              <JobCard job={dummyJobs[0]} slug="#" />
            </div>
            <div>
              <JobCard job={dummyJobs[1]} slug="#" />
            </div>
            <div className="hidden 2xl:block">
              <JobCard job={dummyJobs[2]} slug="#" />
            </div>
          </div>
        </div>
      </header>
      <section className="py-[1.20rem] px-4">
        <div className="w-full lg:w-[60%] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything you need to start hiring.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-theme border border-dashed rounded-none">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white font-medium !mb-2 text-foreground">
                  Beautiful Career Pages
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium text-foreground">
                  Create stunning, branded career pages that showcase your
                  company culture and attract top talent.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-theme border border-dashed rounded-none">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white font-medium !mb-2">
                  Easy Job Posting
                </CardTitle>
                <CardDescription className="text-gray-400 font-medium">
                  Post jobs in minutes with our intuitive editor. Add
                  requirements, benefits, and company info effortlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-theme border border-dashed rounded-none">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white font-medium !mb-2">
                  Applicant Management
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                  Track, review, and manage all applications in one place.
                  Collaborate with your team seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-theme border border-dashed rounded-none">
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-white font-medium !mb-2">
                  Analytics & Insights
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                  Get detailed analytics on job performance, application rates,
                  and hiring metrics.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

const dummyJobs: Job[] = [
  {
    id: "job_001",
    title: "Senior Software Engineer",
    type: "FULLTIME",
    status: "PUBLISHED",
    locationMode: "HYBRID",
    address: "123 Tech Street",
    country: "United States",
    city: "San Francisco",
    description:
      "We are looking for an experienced software engineer to join our team.",
    salaryMin: 120000,
    salaryMax: 180000,
    currency: "USD",
    salaryInterval: "YEARLY",
    experienceLevel: "SENIOR",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
    organizationId: "org_demo_001",
    categoryId: "cat_engineering",
  },
  {
    id: "job_002",
    title: "Product Designer",
    type: "FULLTIME",
    status: "PUBLISHED",
    locationMode: "REMOTE",
    address: null,
    country: "United Kingdom",
    city: "London",
    description: "Join our design team to create beautiful user experiences.",
    salaryMin: 70000,
    salaryMax: 95000,
    currency: "GBP",
    salaryInterval: "YEARLY",
    experienceLevel: "MID",
    createdAt: new Date("2026-01-20"),
    updatedAt: new Date("2026-01-20"),
    organizationId: "org_demo_001",
    categoryId: "cat_design",
  },
  {
    id: "job_003",
    title: "Marketing Intern",
    type: "INTERNSHIP",
    status: "PUBLISHED",
    locationMode: "ONSITE",
    address: "456 Business Ave",
    country: "Germany",
    city: "Berlin",
    description: "Great opportunity for students to learn digital marketing.",
    salaryMin: 1500,
    salaryMax: 2000,
    currency: "EUR",
    salaryInterval: "MONTHLY",
    experienceLevel: "ENTRY",
    createdAt: new Date("2026-01-25"),
    updatedAt: new Date("2026-01-25"),
    organizationId: "org_demo_001",
    categoryId: "cat_marketing",
  },
];
