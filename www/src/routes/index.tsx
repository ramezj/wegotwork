import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import {
  Building2,
  FileText,
  Users,
  Rocket,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Browser } from "@/components/shared/browser";
import type { JobWithCategory } from "@/types/job/job";
import { buildSeo } from "@/lib/seo";

const platformHighlights = [
  {
    title: "Create career pages",
    description:
      "Launch branded careers pages that look polished, feel trustworthy, and are ready to share.",
  },
  {
    title: "Post job openings",
    description:
      "Publish roles with clear job details, hiring context, location information, and compensation when needed.",
  },
  {
    title: "Receive applicants",
    description:
      "Collect candidate applications, resumes, and screening answers in one consistent flow.",
  },
  {
    title: "Manage the hiring process",
    description:
      "Review applicants, move candidates through stages, and keep your team aligned without extra tools.",
  },
] as const;

const faqItems = [
  {
    question: "What is Minstra?",
    answer:
      "Minstra is a hiring software platform for organizations and teams that need career pages, job posting, applicant intake, and hiring workflow management in one place.",
  },
  {
    question: "Can Minstra replace disconnected hiring tools?",
    answer:
      "Yes. Minstra is built to replace the fragmented setup of separate career page builders, application forms, spreadsheets, and lightweight pipeline tools.",
  },
  {
    question: "Who is Minstra built for?",
    answer:
      "Minstra is built for organizations and teams that want a cleaner, more organized hiring process without the overhead of a bloated recruiting stack.",
  },
] as const;

export const Route = createFileRoute("/")({
  component: App,
  head: () =>
    buildSeo({
      title: "Minstra",
      description:
        "Minstra helps organizations and teams create career pages, post job openings, receive applicants, and manage the hiring process in one platform.",
      path: "/",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Minstra",
          url: "https://lunics.co",
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Minstra",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: "https://lunics.co",
          description:
            "Hiring software for organizations and teams to create career pages, post jobs, receive applicants, and manage the hiring process in one platform.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        },
      ],
    }),
});

function App() {
  const demoUrl = "https://careers.lunics.co/demo";

  const features = [
    {
      title: "Branded Career Pages",
      description:
        "Create public hiring pages that feel like a real extension of your company, not an afterthought.",
      icon: Building2,
    },
    {
      title: "Structured Job Posting",
      description:
        "Publish openings with the details candidates actually need to understand the role and decide to apply.",
      icon: FileText,
    },
    {
      title: "Applicant Management",
      description:
        "Receive applications, review resumes, and keep candidate information organized from day one.",
      icon: Users,
    },
    {
      title: "Pipeline Visibility",
      description:
        "Track hiring progress, understand stage movement, and keep the process moving across your team.",
      icon: BarChart3,
    },
  ];

  const exampleJobs: JobWithCategory[] = [
    {
      id: "demo-1",
      title: "Senior Frontend Engineer",
      type: "FULLTIME",
      locationMode: "REMOTE",
      status: "PUBLISHED",
      description: null,
      showSalary: false,
      salaryMin: null,
      salaryMax: null,
      currency: "USD",
      salaryInterval: "YEARLY",
      experienceLevel: "SENIOR",
      country: null,
      city: null,
      address: null,
      categoryId: null,
      officeId: null,
      organizationId: "demo",
      pipelineId: "demo",
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: "c1",
        name: "Engineering",
        organizationId: "demo",
        createdAt: new Date(),
      },
      office: null,
    },
    {
      id: "demo-2",
      title: "Product Designer",
      type: "FULLTIME",
      locationMode: "HYBRID",
      status: "PUBLISHED",
      description: null,
      showSalary: false,
      salaryMin: null,
      salaryMax: null,
      currency: "USD",
      salaryInterval: "YEARLY",
      experienceLevel: "MID",
      country: null,
      city: "San Francisco",
      address: null,
      categoryId: null,
      officeId: null,
      organizationId: "demo",
      pipelineId: "demo",
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: "c2",
        name: "Design",
        organizationId: "demo",
        createdAt: new Date(),
      },
      office: {
        id: "o1",
        name: "SF HQ",
        country: "US",
        city: "San Francisco",
        organizationId: "demo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    {
      id: "demo-3",
      title: "Growth Marketing Manager",
      type: "FULLTIME",
      locationMode: "ONSITE",
      status: "PUBLISHED",
      description: null,
      showSalary: false,
      salaryMin: null,
      salaryMax: null,
      currency: "USD",
      salaryInterval: "YEARLY",
      experienceLevel: "MID",
      country: null,
      city: "New York",
      address: null,
      categoryId: null,
      officeId: null,
      organizationId: "demo",
      pipelineId: "demo",
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: "c3",
        name: "Marketing",
        organizationId: "demo",
        createdAt: new Date(),
      },
      office: {
        id: "o2",
        name: "NYC Office",
        country: "US",
        city: "New York",
        organizationId: "demo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      <Header />
      <main className="mx-auto w-full space-y-8 lg:w-[80%]">
        <header className="px-4">
          <section className="relative overflow-hidden rounded-md border p-2 bg-[#f2f1ed] dark:bg-background">
            <div className="relative bg-[#f2f1ed] dark:bg-background px-4 py-8 text-center">
              <div className="animate-hero-reveal mx-auto flex max-w-4xl flex-col items-center gap-4">
                {/* <div className="inline-flex items-center leading-none gap-2 rounded-none border px-4 py-1.5 text-sm font-semibold">
                  <Sparkles className="size-4" />
                  The #1 hiring software for fast-paced teams
                </div> */}
                <h1 className="text-[35px] leading-none text-[#0d0d0d] dark:text-white font-normal tracking-tighter text-balance sm:text-4xl lg:text-5xl 2xl:text-6xl">
                  You're building fast,
                  <span className="block text-[#0d0d0d] dark:text-white font-normal tracking-tighter">
                    Now let's hire fast too.
                  </span>
                </h1>
                {/* <p className="max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                  Minstra helps modern teams run a cleaner hiring process with
                  branded careers pages, public job listings, applicant intake,
                  and structured hiring workflows.
                </p> */}
                <div className="flex w-full max-w-md flex-col items-center justify-center gap-2 sm:flex-row">
                  <Button
                    variant={"outline"}
                    asChild
                    className="w-full sm:w-60 "
                  >
                    <Link to="/auth">Start Hiring</Link>
                  </Button>
                  <Button
                    variant={"default"}
                    asChild
                    className="w-full sm:w-60 "
                  >
                    <a href={demoUrl} target="_blank" rel="noreferrer">
                      See Demo
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </header>

        <section className="px-4">
          <Browser jobs={exampleJobs} />
        </section>

        <section className="px-4">
          <div className="border rounded-md">
            <div className="grid lg:grid-cols-[0.95fr_1.55fr]">
              <div className="border-b p-2 lg:border-b-0 lg:border-r bg-secondary">
                <div className="px-4 py-8 sm:px-6 sm:py-10 bg-background h-full border rounded-md flex flex-col justify-center text-start space-y-2">
                  {/* <p className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
                    what Minstra gives you
                  </p> */}
                  <h2 className="text-2xl font-normal tracking-tight text-balance sm:text-4xl">
                    The all-in-one hiring platform
                  </h2>
                  <p className="max-w-md text-sm font-normal text-muted-foreground sm:text-base">
                    Everything you need to publish openings, receive applicants,
                    and manage hiring without bouncing between disconnected
                    tools.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2">
                {features.map((feature, index) => {
                  const Icon = feature.icon;

                  return (
                    <article
                      key={feature.title}
                      className={cn(
                        "bg-secondary p-2",
                        index < 3 && "border-b",
                        index >= 2 && "sm:border-b-0",
                        index % 2 === 0 && "sm:border-r",
                      )}
                    >
                      <div className="bg-background border border-input p-6 h-full rounded-md">
                        <div className="mb-5 flex h-10 w-10 items-center justify-center bg-primary rounded-md">
                          <Icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h3 className="text-xl font-normal leading-tight text-primary tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="mt-3 text-sm font-normal leading-6 text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* <section className="px-4">
          <div className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4 rounded-md">
            {platformHighlights.map((item) => (
              <article key={item.title} className="bg-secondary p-2">
                <div className="bg-background border border-input p-4 h-full rounded-md">
                  <h2 className="text-lg font-normal tracking-tight text-primary">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm font-normal leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section> */}

        <section className="px-4">
          <div className="border rounded-md">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="border-b lg:border-b-0 lg:border-r bg-secondary">
                <div className="p-2 h-full flex flex-col justify-center">
                  <div className="bg-background border border-input rounded-md p-6 lg:p-8 h-full flex flex-col justify-center space-y-2">
                    <h2 className="text-3xl font-normal tracking-tight text-balance lg:text-4xl">
                      Who is Minstra for?
                    </h2>
                    <p className="text-sm font-normal text-muted-foreground sm:text-base">
                      Minstra is designed specifically for small teams who need
                      a powerful hiring tool without the enterprise complexity
                      or price tag. If you're tired of spreadsheets but
                      enterprise ATS feels like overkill, you're in the right
                      place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-1">
                <div className="bg-secondary p-2 border-b sm:border-r lg:border-r-0 lg:border-b">
                  <div className="bg-background border border-input rounded-md p-5 h-full">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center bg-primary rounded-md shrink-0">
                        <Rocket className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-base font-normal tracking-tight leading-none">
                          Early-stage Startups
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-normal leading-5 text-muted-foreground">
                      You're hiring your first 10-20 people. You need to look
                      professional to candidates but don't want to spend time
                      configuring complex ATS systems.
                    </p>
                  </div>
                </div>

                <div className="bg-secondary p-2 border-b sm:border-r-0 lg:border-b">
                  <div className="bg-background border border-input rounded-md p-5 h-full">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center bg-primary rounded-md shrink-0">
                        <HeartHandshake className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-base font-normal tracking-tight leading-none">
                          Growing SMEs
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-normal leading-5 text-muted-foreground">
                      You're scaling from 20 to 50+ people. Spreadsheets aren't
                      cutting it anymore, but enterprise tools feel like
                      overkill and cost too much.
                    </p>
                  </div>
                </div>

                <div className="bg-secondary p-2 sm:col-span-2 lg:col-span-1">
                  <div className="bg-background border border-input rounded-md p-5 h-full">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center bg-primary rounded-md shrink-0">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-base font-normal tracking-tight leading-none">
                          Small Agencies
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm font-normal leading-5 text-muted-foreground">
                      You help clients hire and need a clean, white-label
                      friendly platform that won't confuse your clients or your
                      candidates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4">
          <div className="border p-2 bg-secondary rounded-md">
            <div className="bg-background border border-input px-6 py-8 sm:px-8 sm:py-10 rounded-md">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-3">
                  <p className="font-normal text-muted-foreground">
                    Why teams choose Minstra
                  </p>
                  <h2 className="text-3xl font-normal tracking-tight text-balance">
                    Built for fast hiring without the bloated recruiting stack
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="font-normal leading-6 text-muted-foreground sm:text-base">
                    Minstra is a strong fit for companies that want a better
                    candidate-facing experience and a more organized internal
                    workflow at the same time.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button asChild>
                      <Link to="/features">Explore Features</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/pricing">View Pricing</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="px-4">
          <div className="border rounded-md">
            <div className="grid gap-px bg-border lg:grid-cols-3">
              {faqItems.map((item) => (
                <article key={item.question} className="bg-secondary p-2">
                  <div className="bg-background border border-input p-5 h-full rounded-md">
                    <h2 className="text-lg font-normal tracking-tight">
                      {item.question}
                    </h2>
                    <p className="mt-2 text-sm font-normal leading-6 text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section> */}
      </main>
    </div>
  );
}
