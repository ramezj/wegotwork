import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { buildSeo } from "@/lib/seo";

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
  head: () =>
    buildSeo({
      title: "Pricing for Career Page and Hiring Software",
      description:
        "See Lunics pricing for career pages, job posting, applicant management, and team hiring workflows.",
      path: "/pricing",
    }),
});

function PricingPage() {
  return (
    <div className="space-y-8 pb-8">
      <Header />
      <main className="mx-auto w-full space-y-8 px-4 lg:w-[80%]">
        <section className="border p-2 bg-secondary">
          <div className="bg-secondary px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="animate-hero-reveal mx-auto flex max-w-3xl flex-col items-center gap-4">
              {/* <div className="inline-flex items-center gap-2 border px-4 py-1.5 text-sm font-semibold">
                <Sparkles className="size-4" />
                simple pricing
              </div> */}
              <h1 className="max-w-4xl text-4xl font-normal tracking-tight text-balance sm:text-5xl">
                pricing that is simple & straightforward.
              </h1>
              {/* <p className="max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                Start with the essentials for job posting and applicant intake,
                then grow into a fuller hiring workflow as your organization scales.
              </p> */}
            </div>
          </div>
        </section>

        <section>
          <div className="grid lg:grid-cols-2">
            <article className="border p-6 sm:p-8 bg-secondary">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-normal text-muted-foreground">
                    Free
                  </p>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-normal tracking-tight">$0</h2>
                    <p className="text-sm font-normal text-muted-foreground">
                      For teams launching a careers page and their first hiring
                      workflow.
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
                  <Link to="/auth">
                    Start Free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </article>

            <article className="bg-secondary p-2 border">
              <div className="p-6 sm:p-8 bg-background border border-input">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="inline-flex border px-3 py-1 text-xs font-normal text-primary-foreground bg-primary">
                      Enterprise
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-normal tracking-tight text-primary">
                        $50
                      </h2>
                      <p className="max-w-md text-sm font-normal text-muted-foreground">
                        For organizations hiring across teams, offices, and more
                        advanced recruiting workflows.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-6">
                    {enterpriseFeatures.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-primary">
                          <Check className="size-3" />
                        </div>
                        <p className="text-sm font-normal leading-6 text-primary">
                          {feature}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button
                    asChild
                    variant="default"
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

        <section className="border p-5 bg-secondary">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-2">
              <p className="font-normal tracking-tight text-muted-foreground">
                Included
              </p>
              <h3 className="text-2xl font-normal tracking-tight">
                The essentials are built in from day one.
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border px-4 py-4 bg-background border-input">
                <p className="text-sm font-normal">Branded careers page</p>
                <p className="mt-1 text-sm font-normal text-muted-foreground">
                  Publish roles on a public page that feels clean and ready to
                  share.
                </p>
              </div>
              <div className="border px-4 py-4 bg-background border-input">
                <p className="text-sm font-normal">Hiring workflow</p>
                <p className="mt-1 text-sm font-normal text-muted-foreground">
                  Move candidates through stages without losing context or
                  structure.
                </p>
              </div>
              <div className="border px-4 py-4 bg-background border-input">
                <p className="text-sm font-normal">Applications and forms</p>
                <p className="mt-1 text-sm font-normal text-muted-foreground">
                  Collect the right details from candidates with custom
                  questions.
                </p>
              </div>
              <div className="border px-4 py-4 bg-background border-input">
                <p className="text-sm font-normal">Team-ready foundation</p>
                <p className="mt-1 text-sm font-normal text-muted-foreground">
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
