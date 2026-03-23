import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/features/auth/server-session";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { BarChart3, Sparkles } from "lucide-react";
import { JobWithCategory } from "@/types/job/job";
import { Browser } from "@/components/shared/browser";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, FileText, Users } from "lucide-react";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getSession();
    return { session };
  },
  component: App,
  head: () => ({
    meta: [
      {
        title: "loux - why not hire fast too?",
        description: "loux - you're building fast, why not hire fast too?",
      },
    ],
  }),
});

function App() {
  const { session } = Route.useRouteContext();
  return (
    <div className="space-y-12">
      <div className="h-16" />
      <Header session={session} />
      <main className="space-y-8 lg:w-[80%] w-full mx-auto">
        <header className="flex flex-col space-y-8 px-4">
          <section className="relative overflow-hidden rounded-none border p-3">
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/blue.png')" }}
            />
            <div className="relative bg-white px-4 py-12 text-center sm:px-8 sm:py-16">
              <div className="mx-auto flex max-w-4xl flex-col items-center space-y-6">
                <div className="inline-flex items-center gap-2 rounded-none border px-3 py-1 text-sm font-semibold">
                  <Sparkles className="size-4" />
                  Built for fast-moving teams
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl 2xl:text-6xl">
                  You're building fast,
                  <span className="block text-branding">
                    why not hire fast too?
                  </span>
                </h1>
                <p className="max-w-2xl text-base font-medium leading-7 text-muted-foreground sm:text-lg">
                  Launch a clean careers page, publish roles quickly, and keep
                  every application and hiring decision in one focused place.
                </p>
              </div>
            </div>
          </section>
          <div className="flex flex-col items-center px-0">
            <div className="flex w-full flex-row items-center justify-center gap-4">
              <Button variant={"secondary"} asChild className="flex-1 ">
                <a href={"https://jobs.wegotwork.co/demo"} target="_blank">
                  See Demo
                </a>
              </Button>
              <Button variant={"default"} asChild className="flex-1">
                <Link to={"/"} target="_blank">
                  Start Hiring
                </Link>
              </Button>
            </div>
          </div>
        </header>
        <section className="px-4">
          <Browser jobs={[dummyJobs[0], dummyJobs[1]]} />
        </section>
        <section className="px-4">
          <div className="w-full mx-auto flex flex-col space-y-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-semibold leading-tight text-balance ">
                The simplest all-in-one hiring platform
              </h1>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="font-semibold">
                    Beautiful Career Pages
                  </CardTitle>
                  <CardDescription className="font-medium text-muted-foreground">
                    Create stunning, branded career pages that showcase your
                    company culture and attract top talent.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="font-semibold">
                    Easy job posting
                  </CardTitle>
                  <CardDescription className="font-medium text-muted-foreground">
                    Post jobs in minutes with our intuitive editor. Add
                    requirements, benefits, and company info effortlessly.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="font-semibold">
                    Applicant management
                  </CardTitle>
                  <CardDescription className="font-medium text-muted-foreground">
                    Track, review, and manage all applications in one place.
                    collaborate with your team seamlessly.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="font-semibold">
                    Analytics & insights
                  </CardTitle>
                  <CardDescription className="font-medium text-muted-foreground">
                    Get detailed analytics on job performance, application
                    rates, and hiring metrics.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const dummyJobs: JobWithCategory[] = [
  {
    id: "#",
    title: "Senior Software Engineer",
    type: "FULLTIME",
    status: "PUBLISHED",
    locationMode: "HYBRID",
    address: "123 Tech Street",
    country: "United States",
    city: "San Francisco",
    description:
      "We are looking for an experienced software engineer to join our team.",
    showSalary: false,
    salaryMin: 120000,
    salaryMax: 180000,
    currency: "USD",
    salaryInterval: "YEARLY",
    experienceLevel: "SENIOR",
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: "#",
    categoryId: "#",
    pipelineId: "#",
    category: {
      id: "#",
      name: "Engineering",
      createdAt: new Date(),
      organizationId: "#",
    },
    questions: [],
  },
  {
    id: "#",
    title: "Product Designer",
    type: "FULLTIME",
    status: "PUBLISHED",
    locationMode: "REMOTE",
    address: null,
    country: "United States",
    city: "Remote",
    description: "Looking for a product designer with a strong portfolio.",
    showSalary: false,
    salaryMin: 100000,
    salaryMax: 150000,
    currency: "USD",
    salaryInterval: "YEARLY",
    experienceLevel: "MID",
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: "#",
    categoryId: "#",
    pipelineId: "#",
    category: {
      id: "#",
      name: "Design",
      createdAt: new Date(),
      organizationId: "#",
    },
    questions: [],
  },
  {
    id: "#",
    title: "Marketing Intern",
    type: "INTERNSHIP",
    status: "PUBLISHED",
    locationMode: "ONSITE",
    address: "456 Creative Ave",
    country: "United Kingdom",
    city: "London",
    description: "Join our marketing team as an intern and learn the ropes.",
    showSalary: false,
    salaryMin: 2000,
    salaryMax: 3000,
    currency: "GBP",
    salaryInterval: "MONTHLY",
    experienceLevel: "ENTRY",
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: "#",
    categoryId: "#",
    pipelineId: "#",
    category: {
      id: "#",
      name: "Marketing",
      createdAt: new Date(),
      organizationId: "#",
    },
    questions: [],
  },
];
