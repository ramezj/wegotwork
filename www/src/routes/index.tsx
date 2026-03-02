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
  ArrowRight,
  BarChart3,
  Building2,
  FileText,
  Users,
} from "lucide-react";
import { JobWithCategory } from "@/types/job/job";
import { Badge } from "@/components/ui/badge";
import { Browser } from "@/components/shared/browser";

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
    <div className="space-y-12">
      <div className="lg:w-[70%] w-full mx-auto sticky top-5 z-50 px-4">
        <Header session={session} />
      </div>
      <main className="space-y-8 lg:w-[70%] w-full mx-auto">
        <header className="flex flex-col space-y-8">
          <section className="flex flex-col items-center text-center px-2">
            <div className="w-full px-4">
              {/* <Badge variant={"default"}>Currently in early development</Badge> */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-7xl font-semibold leading-tight text-balance">
                The Whole Hiring Process. One Ark.
              </h1>
              <p className="text-[1rem] font-medium text-balance text-muted-foreground">
                Start with a career page, then run every job post, application,
                and hiring decision inside one organized Ark.
              </p>
            </div>
          </section>
          <div className="flex flex-col items-center px-4">
            <div className="flex flex-row w-full items-center justify-center content-center gap-4">
              <Button variant={"secondary"} asChild className="flex-1">
                <a href={"https://jobs.wegotwork.co/demo"} target="_blank">
                  See Demo
                </a>
              </Button>
              <Button variant={"default"} asChild className="flex-1 group">
                <Link to={"/"} target="_blank">
                  Start Hiring
                  <ArrowRight className="duration-100 group-hover:-rotate-45" />
                </Link>
              </Button>
            </div>
          </div>
          <section className="px-4">
            <Browser jobs={[dummyJobs[0], dummyJobs[1]]} />
          </section>
        </header>
        <section className="px-4">
          <div className="w-full mx-auto flex flex-col space-y-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-semibold leading-tight text-balance">
                Everything you need to start hiring
              </h1>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="font-semibold mb-2!">
                    Beautiful Career Pages
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">
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
                  <CardTitle className="font-semibold mb-2!">
                    Easy Job Posting
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">
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
                  <CardTitle className="font-semibold mb-2!">
                    Applicant Management
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">
                    Track, review, and manage all applications in one place.
                    Collaborate with your team seamlessly.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle className="font-semibold mb-2!">
                    Analytics & Insights
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-medium">
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
    salaryMin: 120000,
    salaryMax: 180000,
    currency: "USD",
    salaryInterval: "YEARLY",
    experienceLevel: "SENIOR",
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: "#",
    categoryId: "#",
    pipelineId: null,
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
    salaryMin: 100000,
    salaryMax: 150000,
    currency: "USD",
    salaryInterval: "YEARLY",
    experienceLevel: "MID",
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: "#",
    categoryId: "#",
    pipelineId: null,
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
    salaryMin: 2000,
    salaryMax: 3000,
    currency: "GBP",
    salaryInterval: "MONTHLY",
    experienceLevel: "ENTRY",
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: "#",
    categoryId: "#",
    pipelineId: null,
    category: {
      id: "#",
      name: "Marketing",
      createdAt: new Date(),
      organizationId: "#",
    },
    questions: [],
  },
];
