import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/features/auth/server-session";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { BarChart3, Sparkles } from "lucide-react";
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
    <div className="space-y-8 pb-8">
      <Header session={session} />
      <main className="mx-auto w-full space-y-8 lg:w-[80%]">
        <header className="px-4">
          <section className="relative overflow-hidden rounded-none border p-2">
            <div className="relative bg-white px-4 py-8 text-center">
              <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
                <div className="inline-flex items-center leading-none gap-2 rounded-none border px-4 py-1.5 text-sm font-semibold">
                  <Sparkles className="size-4" />
                  built for fast paced teams
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl 2xl:text-6xl">
                  You're building fast.
                  <span className="block text-branding">
                    Why not hire fast too?
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
                      See Demo
                    </a>
                  </Button>
                  <Button
                    variant={"default"}
                    asChild
                    className="w-full sm:w-72"
                  >
                    <Link to={"/"} target="_blank">
                      Start Hiring
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          {/* <section className="text-center border p-8">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-none border px-3 py-1 text-sm font-semibold leading-none">
                <Sparkles className="size-4" />
                Built for fast paced teams
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-5xl 2xl:text-6xl">
                You're building fast.
                <span className="block text-branding">
                  Why not hire fast too?
                </span>
              </h1>
              <p className="max-w-2xl text-base font-medium text-muted-foreground sm:text-lg">
                Create a career page, post jobs, and manage applicants all in
                one focused platform.
              </p>
              <div className="flex w-full max-w-sm flex-col items-center justify-center gap-2 sm:flex-row">
                <Button
                  variant={"secondary"}
                  asChild
                  className="w-full sm:w-72"
                >
                  <a href={"https://jobs.wegotwork.co/demo"} target="_blank">
                    See Demo
                  </a>
                </Button>
                <Button variant={"default"} asChild className="w-full sm:w-72">
                  <Link to={"/"} target="_blank">
                    Start Hiring
                  </Link>
                </Button>
              </div>
            </div>
          </section> */}
        </header>
        <section className="px-4">
          <div
            className="bg-cover bg-center p-3"
            style={{ backgroundImage: "url('/blue.png')" }}
          >
            <div className="bg-white">
              <img
                src="/dashboard.png"
                alt="Loux dashboard preview"
                className="block h-auto w-full"
              />
            </div>
          </div>
        </section>
        <section className="px-4">
          <div className="border">
            <div className="grid lg:grid-cols-[0.95fr_1.55fr]">
              <div className="border-b p-4 lg:border-b-0 lg:border-r">
                <div className="bg-white px-4 py-8 sm:px-6 sm:py-10">
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
