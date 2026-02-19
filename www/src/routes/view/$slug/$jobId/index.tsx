import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { viewJobQueryOptions } from "@/features/queries/jobs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Globe } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/view/$slug/$jobId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug, jobId } = Route.useParams();
  const { data } = useSuspenseQuery(viewJobQueryOptions(jobId));

  if (!data?.success || !data?.job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
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

  return (
    <div className="flex flex-col items-center py-12 px-4 space-y-8 w-full max-w-4xl mx-auto animate-fade-in">
      {/* Header / Back Link */}
      <div className="w-full flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/view/$slug" params={{ slug }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Jobs
          </Link>
        </Button>
      </div>

      <div className="w-full grid md:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          {/* Job Title & Badges */}
          <div className="space-y-4">
            <h1 className="text-4xl font-medium tracking-tight leading-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {job.category && (
                <Badge variant="secondary">{job.category.name}</Badge>
              )}
              <Badge variant="outline">{job.type.replace("_", " ")}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="size-3" />
                {job.locationMode}
              </Badge>
            </div>
          </div>

          {/* Job Description */}
          <div className="prose prose-invert max-w-none">
            <div className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {job.description || "No description provided."}
            </div>
          </div>

          {/* Apply Button (Sticky on mobile?) */}
          <div className="pt-8">
            <Button size="lg" className="px-8">
              Apply for this position
            </Button>
          </div>
        </div>

        {/* Sidebar / Org Info */}
        <aside className="space-y-6">
          <Card className="bg-input/10 border-none rounded-none">
            <CardHeader className="pb-4">
              <Avatar className="size-20 rounded-none border border-border">
                <AvatarImage
                  src={`${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${job.organization.logo}`}
                />
                <AvatarFallback className="bg-white text-black text-2xl font-medium">
                  {job.organization.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h2 className="font-medium text-lg leading-none">
                  About {job.organization.name}
                </h2>
                {job.organization.website && (
                  <a
                    href={job.organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Globe className="size-3" />
                    Visit website
                  </a>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {job.organization.description ||
                  "No organization description available."}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
