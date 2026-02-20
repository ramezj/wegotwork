import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { viewJobQueryOptions } from "@/features/queries/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Briefcase, Paperclip } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/view/$slug/$jobId/")({
  component: RouteComponent,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(viewJobQueryOptions(params.jobId)),
});

function RouteComponent() {
  const { slug, jobId } = Route.useParams();
  const { data } = useSuspenseQuery(viewJobQueryOptions(jobId));
  const [resumeName, setResumeName] = useState<string | null>(null);

  if (!data?.success || !data?.job) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Job not found or no longer available.
        </p>
        <Button asChild variant="outline">
          <Link to="/view/$slug" params={{ slug }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Open Roles
          </Link>
        </Button>
      </div>
    );
  }

  const { job } = data;

  const typeLabel = job.type
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join("-");

  const locationLabel =
    job.locationMode.charAt(0) + job.locationMode.slice(1).toLowerCase();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 flex flex-col space-y-4">
      {/* Back */}
      <Link
        viewTransition
        to="/view/$slug"
        params={{ slug }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="size-4" />
        Back to all jobs
      </Link>

      {/* ── Job info ── */}
      <div className="flex flex-col">
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold tracking-tight leading-snug">
            {job.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {job.organization.name}
          </p>
        </div>

        <div className="flex flex-wrap">
          {job.category && (
            <Badge variant="secondary" className="rounded-sm">
              {job.category.name}
            </Badge>
          )}
          <Badge
            variant="outline"
            className="rounded-sm flex items-center gap-1.5"
          >
            <Briefcase className="size-3" />
            {typeLabel}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-sm flex items-center gap-1.5"
          >
            <MapPin className="size-3" />
            {locationLabel}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* ── Description ── */}
      <div className="text-sm leading-7 text-foreground/80 whitespace-pre-wrap">
        {job.description || "No description provided."}
      </div>

      <Separator />

      {/* ── Application Form ── */}
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">Apply</h2>

        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: wire up submission
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">
              Full name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" placeholder="Jane Doe" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted text-muted-foreground text-xs rounded-l-sm shrink-0">
                linkedin.com/in/
              </span>
              <Input
                id="linkedin"
                placeholder="yourhandle"
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="portfolio">Portfolio / Website</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-input bg-muted text-muted-foreground text-xs rounded-l-sm shrink-0">
                https://
              </span>
              <Input
                id="portfolio"
                placeholder="yourwebsite.com"
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>
              Resume / CV <span className="text-destructive">*</span>
            </Label>
            <label
              htmlFor="resume"
              className="flex items-center gap-2 w-fit cursor-pointer border border-input rounded-sm px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Paperclip className="size-4 shrink-0" />
              {resumeName ?? "Attach file"}
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) =>
                  setResumeName(e.target.files?.[0]?.name ?? null)
                }
              />
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cover">
              Why are you a great fit?{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="cover"
              placeholder="Tell us about yourself and why you're excited about this role..."
              className="min-h-32 resize-y"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="extra">Anything else?</Label>
            <Textarea
              id="extra"
              placeholder="Work samples, projects, references..."
              className="min-h-24 resize-y"
            />
          </div>

          <Button type="submit" size="lg" className="w-full mt-2">
            Submit application
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting you agree to our privacy policy and terms of service.
          </p>
        </form>
      </div>
    </div>
  );
}
