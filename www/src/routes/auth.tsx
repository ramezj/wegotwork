import Header from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { authClient } from "@/features/auth/auth-client";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Check,
  Shield,
  Sparkles,
  Users2,
} from "lucide-react";

const accessPoints = [
  "Your organization dashboard and hiring workspace",
  "Pipelines, offices, jobs, and candidate workflows",
  "Role-based team access tied to your organization",
];

const highlights = [
  {
    title: "Hiring Workspace",
    description:
      "Manage jobs, candidates, pipelines, and offices from one structured dashboard.",
    icon: Building2,
  },
  {
    title: "Team Access",
    description:
      "Invite teammates and keep permissions scoped cleanly to each organization.",
    icon: Users2,
  },
  {
    title: "Secure Sign-In",
    description:
      "Continue with Google and land directly in the workspace you already use.",
    icon: Shield,
  },
];

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      {
        title: "Sign In - lunics",
        description: "Access your lunics hiring workspace.",
      },
    ],
  }),
});

function AuthPage() {
  const { data: session } = authClient.useSession();

  const handleGoogleSignIn = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="space-y-8 pb-8">
      <Header />
      <main className="mx-auto w-full space-y-8 px-4 lg:w-[80%]">
        <section className="border p-2">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="border-b-0 bg-background px-6 py-10 sm:px-10 sm:py-12 lg:border-b-0 lg:border-r-0">
              <div className="max-w-xl space-y-6">
                {/* <div className="inline-flex items-center gap-2 border px-4 py-1.5 text-sm font-semibold">
                  <Sparkles className="size-4" />
                  Access your workspace
                </div> */}

                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                    Sign in to your hiring workspace.
                  </h1>
                  <p className="max-w-lg text-base leading-7 text-muted-foreground">
                    Continue with Google to access your organization dashboard,
                    manage roles, and move hiring forward without friction.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {session?.user ? (
                    <Button asChild size="lg" className="sm:min-w-[220px]">
                      <Link to="/dashboard">
                        Open Dashboard
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="sm:min-w-[220px]"
                      onClick={handleGoogleSignIn}
                    >
                      Continue with Google
                      <ArrowRight className="size-4" />
                    </Button>
                  )}

                  {/* <Button asChild size="lg" variant="secondary">
                    <Link to="/">Back Home</Link>
                  </Button> */}
                </div>

                <div className="border-t pt-6">
                  <div className="space-y-3">
                    {accessPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border">
                          <Check className="size-3" />
                        </div>
                        <p className="text-sm font-medium leading-6">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-cover bg-center p-3"
              style={{ backgroundImage: "url('/blue.png')" }}
            >
              <div className="flex h-full min-h-[360px] flex-col justify-between bg-black/90 p-6 text-white sm:p-8">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                    What You Unlock
                  </p>
                  <h2 className="max-w-md text-3xl font-semibold tracking-tight text-white">
                    Everything your team needs to operate hiring in one place.
                  </h2>
                </div>

                <div className="space-y-4 border-t border-white/15 pt-6">
                  {highlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="grid gap-3 sm:grid-cols-[44px_1fr]"
                      >
                        <div className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5">
                          <Icon className="size-5 text-white" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="text-sm leading-6 text-white/72">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border px-6 py-6 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Access Model
              </p>
              <h3 className="text-2xl font-semibold tracking-tight">
                Sign-in stays simple. Organization access stays structured.
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border px-4 py-4">
                <p className="text-sm font-semibold">Google sign-in</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Fast entry with the identity your team already uses.
                </p>
              </div>
              <div className="border px-4 py-4">
                <p className="text-sm font-semibold">
                  Organization-based access
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Workspaces, permissions, and billing stay tied to the company.
                </p>
              </div>
              <div className="border px-4 py-4">
                <p className="text-sm font-semibold">Owner-level controls</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Sensitive areas like billing remain limited to the right role.
                </p>
              </div>
              <div className="border px-4 py-4">
                <p className="text-sm font-semibold">
                  Ready for team workflows
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  Hiring moves cleanly from public jobs to the internal
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
