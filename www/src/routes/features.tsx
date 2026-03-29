import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/features/auth/server-session";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Building2,
  FileText,
  GitBranch,
  MapPinned,
  Sparkles,
  Users,
} from "lucide-react";

const featureGroups = [
  {
    title: "Public Hiring Surface",
    description:
      "Give candidates a cleaner first impression with a careers page that already feels considered.",
    items: [
      {
        title: "Branded job pages",
        description:
          "Publish roles on public pages that look organized, readable, and ready to share.",
        icon: Building2,
      },
      {
        title: "Structured job details",
        description:
          "Show work mode, office, category, compensation, and description in one clear flow.",
        icon: FileText,
      },
    ],
  },
  {
    title: "Hiring Workflow",
    description:
      "Everything you need to move from posting a job to making a decision without switching systems.",
    items: [
      {
        title: "Custom pipelines",
        description:
          "Create stages that reflect how your team actually reviews candidates.",
        icon: GitBranch,
      },
      {
        title: "Candidate management",
        description:
          "Review, move, and organize applicants without losing context or momentum.",
        icon: Users,
      },
    ],
  },
  {
    title: "Operational Structure",
    description:
      "Keep hiring organized across categories, offices, and multiple teams as things grow.",
    items: [
      {
        title: "Offices and locations",
        description:
          "Assign roles to real offices so candidates can immediately understand where a role belongs.",
        icon: MapPinned,
      },
      {
        title: "Insights and visibility",
        description:
          "Track open roles, categories, offices, and pipeline movement from one place.",
        icon: BarChart3,
      },
    ],
  },
] as const;

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
  head: () => ({
    meta: [
      {
        title: "Features - lunics",
        description:
          "Explore the hiring workflows and tools built into lunics.",
      },
    ],
  }),
});

function FeaturesPage() {
  return (
    <div className="space-y-8 pb-8">
      <Header />
      <main className="mx-auto w-full space-y-8 px-4 lg:w-[80%]">
        <section className="border p-2">
          <div className="bg-white px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
              {/* <div className="inline-flex items-center gap-2 border px-4 py-1.5 text-sm font-semibold">
                <Sparkles className="size-4" />
                everything in one place
              </div> */}
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Features built for teams that want hiring to feel well run.
              </h1>
              {/* <p className="max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                lunics brings the public side of hiring and the internal workflow
                together, so your team can post roles, review candidates, and
                stay organized without extra layers.
              </p> */}
            </div>
          </div>
        </section>

        {featureGroups.map((group) => (
          <section key={group.title} className="border">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="border-b px-6 py-8 lg:border-r lg:border-b-0 sm:px-8">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {group.title}
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-balance">
                    {group.title}
                  </h2>
                  <p className="max-w-md text-sm font-medium leading-6 text-muted-foreground">
                    {group.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-px bg-border sm:grid-cols-2">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="bg-white px-6 py-8 sm:px-8"
                    >
                      <div className="space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center border bg-secondary">
                          <Icon className="size-5" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold tracking-tight">
                            {item.title}
                          </h3>
                          <p className="text-sm font-medium leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        <section className="border p-2">
          <div className="bg-white px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Ready to use lunics?
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-balance">
                  Start with the essentials, then grow into a fuller hiring
                  setup.
                </h2>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="secondary" asChild>
                  <Link to="/pricing">See Pricing</Link>
                </Button>
                <Button asChild>
                  <Link to="/">
                    Start Hiring
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
