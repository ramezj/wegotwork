import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { buildSeo } from "@/lib/seo";
import plansData from "@/data/plans.json";

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
        <section className="border p-2 bg-secondary rounded-md">
          <div className="bg-secondary px-6 py-10 text-center sm:px-10 sm:py-14">
            <div className="animate-hero-reveal mx-auto flex max-w-3xl flex-col items-center gap-4">
              {/* <div className="inline-flex items-center gap-2 border px-4 py-1.5 text-sm font-semibold">
                <Sparkles className="size-4" />
                simple pricing
              </div> */}
              <h1 className="max-w-4xl text-4xl font-normal tracking-tight text-balance sm:text-5xl">
                No surprises. No hidden fees. Just pricing.
              </h1>
              {/* <p className="max-w-2xl text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                Start with the essentials for job posting and applicant intake,
                then grow into a fuller hiring workflow as your organization scales.
              </p> */}
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-4">
          {plansData.plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-5 flex flex-col h-full ${plan.isPopular ? "relative" : ""}`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex flex-col h-full">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-normal tracking-tight">
                      {plan.priceLabel.split("/")[0]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.pricePeriod}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Jobs</span>
                    <span className="font-medium">
                      {plan.quotas.maxJobs === -1
                        ? "Unlimited"
                        : plan.quotas.maxJobs}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Seats</span>
                    <span className="font-medium">
                      {plan.quotas.maxMembers === -1
                        ? "Unlimited"
                        : plan.quotas.maxMembers}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Offices</span>
                    <span className="font-medium">
                      {plan.quotas.maxOffices === -1
                        ? "Unlimited"
                        : plan.quotas.maxOffices}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-4 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${plan.isPopular ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <p
                        className={`text-sm ${plan.isPopular ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                {plan.cta.href ? (
                  <Button
                    asChild
                    variant={plan.cta.variant as "default" | "outline"}
                    className="w-full mt-6"
                  >
                    <a href={plan.cta.href}>{plan.cta.text}</a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant={plan.cta.variant as "default" | "outline"}
                    className="w-full mt-6"
                  >
                    <Link to="/auth">{plan.cta.text}</Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </section>

        {/* <section className="border p-5 bg-secondary rounded-md">
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
              <div className="border px-4 py-4 bg-background border-input rounded-md">
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
        </section> */}
      </main>
    </div>
  );
}
