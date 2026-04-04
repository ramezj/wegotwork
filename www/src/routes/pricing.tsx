import { createFileRoute, Link } from "@tanstack/react-router";
import { getSession } from "@/features/auth/server-session";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const freeFeatures = [
  "Careers page and public job listings",
  "Job posting and application intake",
  "Pipeline and stage management",
  "Candidate review and movement",
  "Categories and offices support",
];

const enterpriseFeatures = [
  "Everything in Free",
  "Custom onboarding and rollout support",
  "Multi-team hiring workflows",
  "Advanced collaboration and permissions",
  "Priority support and tailored setup",
];

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      {
        title: "Pricing - lunics",
        description: "Simple pricing for teams hiring with lunics.",
      },
    ],
  }),
});

function PricingPage() {
  return (
    <div className="space-y-8 pb-8">
      <Header />
      <main className="mx-auto w-full space-y-8 px-4 lg:w-[80%]">
        <section className="border p-2">
          <div className="bg-secondary px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
              {/* <div className="inline-flex items-center gap-2 border px-4 py-1.5 text-sm font-semibold">
                <Sparkles className="size-4" />
                simple pricing
              </div> */}
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Pricing that stays clear as your team grows.
              </h1>
              {/* <p className="max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                Start for free, publish your jobs, and move into a tailored
                enterprise setup when hiring becomes a larger operation.
              </p> */}
            </div>
          </div>
        </section>

        <section>
          <div className="grid lg:grid-cols-2">
            <article className="border p-6 sm:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Free
                  </p>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-semibold tracking-tight">
                      $0
                    </h2>
                    <p className="text-sm font-medium text-muted-foreground">
                      For teams getting their hiring system in place.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-6">
                  {freeFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border">
                        <Check className="size-3" />
                      </div>
                      <p className="text-sm font-medium leading-6">{feature}</p>
                    </div>
                  ))}
                </div>

                <Button asChild className="w-full sm:w-auto">
                  <Link to="/">
                    Start Free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </article>

            <article
              className="bg-cover bg-center p-3"
              style={{ backgroundImage: "url('/blue.png')" }}
            >
              <div className="bg-black/90 p-6 text-white backdrop-blur-md sm:p-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="inline-flex border border-white/20 px-3 py-1 text-xs font-semibold text-white">
                      Enterprise
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-semibold tracking-tight text-white">
                        $50
                      </h2>
                      <p className="max-w-md text-sm font-medium text-white/75">
                        For organizations hiring across offices, teams, or more
                        complex workflows.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-white/15 pt-6">
                    {enterpriseFeatures.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/25 text-white">
                          <Check className="size-3" />
                        </div>
                        <p className="text-sm font-medium leading-6 text-white">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    <a href="mailto:hello@lunics.co?subject=Enterprise%20Plan">
                      Contact Sales
                      <ArrowRight className="size-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="border px-6 py-6 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Included
              </p>
              <h3 className="text-2xl font-semibold tracking-tight">
                The essentials are built in from day one.
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border px-4 py-4">
                <p className="text-sm font-semibold">Branded careers page</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Publish roles on a public page that feels clean and ready to
                  share.
                </p>
              </div>
              <div className="border px-4 py-4">
                <p className="text-sm font-semibold">Hiring workflow</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Move candidates through stages without losing context or
                  structure.
                </p>
              </div>
              <div className="border px-4 py-4">
                <p className="text-sm font-semibold">Applications and forms</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Collect the right details from candidates with custom
                  questions.
                </p>
              </div>
              <div className="border px-4 py-4">
                <p className="text-sm font-semibold">Team-ready foundation</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Offices, categories, and pipelines are already part of the
                  workflow.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
