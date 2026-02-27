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
  ArrowUpRight,
  BarChart3,
  Building2,
  FileText,
  Users,
} from "lucide-react";
import { JobCard } from "@/components/job/job-card";
import { JobWithCategory } from "@/types/job/job";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-8">
      <Header session={session} />
      <main className="space-y-8 lg:w-[70%] w-full mx-auto">
        <header className="flex flex-col space-y-8">
          <section className="flex flex-col items-center text-center px-2">
            <div className="w-full px-4">
              <Badge variant={"secondary"}>
                currently in development phase
              </Badge>
              <h1 className="text-2xl sm:text-4xl lg:text-4xl 2xl:text-6xl font-medium leading-tight text-balance">
                The hiring platform for modern teams
              </h1>
              <p className="text-[1rem] font-light text-balance text-muted-foreground">
                create stunning career pages, post jobs, manage applicants — all
                from one, easy-to-use platform.
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
            <div className="w-full mx-auto browser-glow">
              {/* Browser chrome */}
              <div className="border border-border bg-card rounded-lg">
                <div className="flex items-center gap-2 border-b border-border p-4">
                  <div className="flex gap-1.5">
                    <div className="size-3 bg-secondary rounded-full" />
                    <div className="size-3 bg-secondary rounded-full" />
                    <div className="size-3 bg-secondary rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-secondary py-1 text-xs text-primary font-medium text-start p-2 rounded-md">
                      jobs.hirelou.app
                    </div>
                  </div>
                </div>
                {/* Job cards inside browser */}
                <div className="p-4 bg-background">
                  <div className="flex flex-col items-center text-center space-y-4 py-8">
                    <Avatar className="w-16 h-16 rounded-lg">
                      <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                        H
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-4">
                      <h3 className="text-3xl md:text-4xl font-medium tracking-tight leading-none">
                        Hirelou
                      </h3>
                      <p className="text-muted-foreground text-base text-balance font-light leading-none">
                        Explore our open positions and join our team in building
                        the future.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <JobCard job={dummyJobs[0]} slug="#" isDemo />
                    </div>
                    <div>
                      <JobCard job={dummyJobs[1]} slug="#" isDemo />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </header>
        <section className="px-4">
          <div className="w-full mx-auto flex flex-col space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-medium text-foreground text-balance">
                Everything you need to start hiring.
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-muted/30">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4 shadow-sm">
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

              <Card className="bg-muted/30">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4 shadow-sm">
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

              <Card className="bg-muted/30">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4 shadow-sm">
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

              <Card className="bg-muted/30">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center mb-4 shadow-sm">
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
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
    organizationId: "org_demo_001",
    categoryId: "cat_engineering",
    category: {
      organizationId: "org_demo_001",
      id: "cat_engineering",
      name: "Engineering",
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
    category: {
      organizationId: "org_demo_001",
      id: "cat_design",
      name: "Design",
    },
    questions: [],
  },
  {
    id: "#",
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
    category: {
      organizationId: "org_demo_001",
      id: "cat_marketing",
      name: "Marketing",
    },
    questions: [],
  },
];
