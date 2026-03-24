import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/features/auth/server-session";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { BarChart3, Sparkles } from "lucide-react";
import { JobWithCategory } from "@/types/job/job";
import { Browser } from "@/components/shared/browser";
import { Building2, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const features = [
    {
      title: "Beautiful Career Pages",
      description:
        "Create clean, branded job pages that feel intentional from the first scroll.",
      icon: Building2,
    },
    {
      title: "Easy Job Posting",
      description:
        "Publish openings quickly with a simple editor for the details that matter.",
      icon: FileText,
    },
    {
      title: "Applicant Management",
      description:
        "Review, move, and organize candidates without your hiring flow turning chaotic.",
      icon: Users,
    },
    {
      title: "Analytics & Insights",
      description:
        "See how jobs perform and where your pipeline is moving or getting stuck.",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-12">
      <div className="h-16" />
      <Header session={session} />
      <main className="space-y-8 lg:w-[80%] w-full mx-auto">
        <header className="flex flex-col space-y-8 px-4">
          <section className="relative overflow-hidden rounded-none p-2.5">
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/blue.png')" }}
            />
            <div className="relative bg-white px-4 py-12 text-center sm:px-8 sm:py-16">
              <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
                <div className="inline-flex items-center leading-none gap-2 rounded-none border px-3 py-1 text-sm font-semibold">
                  <Sparkles className="size-4" />
                  built for fast paced teams
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl 2xl:text-6xl">
                  you're building fast.
                  <span className="block text-branding">
                    why not hire fast too?
                  </span>
                </h1>
                {/* <p className="max-w-xl text-sm font-medium text-muted-foreground sm:text-base">
                  From career page to hiring, everything in one platform
                </p> */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-sm">
                  <Button
                    variant={"secondary"}
                    asChild
                    className="w-full sm:w-72"
                  >
                    <a href={"https://jobs.wegotwork.co/demo"} target="_blank">
                      see demo
                    </a>
                  </Button>
                  <Button
                    variant={"default"}
                    asChild
                    className="w-full sm:w-72"
                  >
                    <Link to={"/"} target="_blank">
                      start hiring
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </header>
        <section className="px-4">
          <div className="space-y-8">
            <div className="border px-4 py-8 text-center sm:px-6 sm:py-10">
              <h2 className="mx-auto max-w-3xl text-2xl font-semibold leading-tight text-balance sm:text-3xl">
                a careers page that already feels polished before you touch a
                single candidate.
              </h2>
            </div>
            <Browser jobs={[dummyJobs[0], dummyJobs[1]]} />
          </div>
        </section>
        <section className="px-4">
          <div className="border">
            <div className="grid lg:grid-cols-[0.95fr_1.55fr]">
              <div className="border-b px-4 py-8 sm:px-6 sm:py-10 lg:border-b-0 lg:border-r">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  what loux gives you
                </p>
                <h2 className="text-2xl font-semibold leading-tight text-balance sm:text-4xl">
                  The simplest all-in-one hiring platform
                </h2>
                <p className="mt-4 max-w-md text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                  everything you need to publish roles, review applicants, and
                  keep your hiring process organized without making it feel
                  heavy.
                </p>
              </div>
              <div className="grid sm:grid-cols-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <article
                      key={feature.title}
                      className={cn(
                        "px-4 py-8 sm:px-6 sm:py-10",
                        index < 2 && "border-b",
                        index % 2 === 0 && "sm:border-r",
                      )}
                    >
                        <div className="mb-5 flex h-12 w-12 items-center justify-center border bg-secondary">
                          <Icon className="h-6 w-6 text-black" />
                        </div>
                        <h3 className="text-xl font-semibold leading-tight">
                          {feature.title}
                        </h3>
                        <p className="mt-3 text-sm font-medium leading-6 text-muted-foreground">
                          {feature.description}
                        </p>
                      </article>
                  );
                })}
              </div>
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
