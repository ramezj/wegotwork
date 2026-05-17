import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock3,
  FileText,
  Mail,
  MessageSquare,
} from "lucide-react";
import { candidateHistoryQueryOptions } from "@/features/queries/ats";
import { jobByIdQueryOptions } from "@/features/queries/jobs";
import { Layout } from "@/components/shared/layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute(
  "/$slug/_layout/candidates/$jobId/$candidateId",
)({
  component: RouteComponent,
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        candidateHistoryQueryOptions(params.candidateId),
      ),
      context.queryClient.ensureQueryData(jobByIdQueryOptions(params.jobId)),
    ]),
});

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatAnswer(answer: unknown) {
  if (Array.isArray(answer)) {
    return answer.join(", ");
  }

  if (typeof answer === "boolean") {
    return answer ? "Yes" : "No";
  }

  return String(answer ?? "");
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-4 py-10 text-center sm:px-6">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b px-4 py-4 sm:px-6">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

function RouteComponent() {
  const { slug, jobId, candidateId } = Route.useParams();
  const { data: jobData } = useSuspenseQuery(jobByIdQueryOptions(jobId));
  const { data: candidate } = useSuspenseQuery(
    candidateHistoryQueryOptions(candidateId),
  );

  if (!candidate || !jobData?.job) {
    return (
      <Layout title="Candidate Not Found">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Candidate not found.</p>
        </div>
      </Layout>
    );
  }

  const job = jobData.job;
  const jobCandidate = job.candidates.find((item) => item.id === candidate.id);
  const currentStageName = jobCandidate?.currentStage?.name || "Submitted";
  const responses = candidate.responses || [];
  const resumeBaseUrl =
    import.meta.env.VITE_R2_PUBLIC_URL ||
    "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev";
  const resumeUrl = `${resumeBaseUrl}/${candidate.resumeKey}`;
  const responseCount = responses.filter((response: any) =>
    Boolean(formatAnswer(response.answer).trim()),
  ).length;

  return (
    <Layout
      title="Candidate Profile"
      className="flex-none min-h-full"
      primaryButton={
        <Button variant="outline" asChild>
          <Link to="/$slug/candidates/$jobId" params={{ slug, jobId }}>
            <ArrowLeft className="size-4" />
            Back to Candidates
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <section className="overflow-hidden border bg-card">
          <div className="border-b px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="size-14 border bg-muted sm:size-16">
                  <AvatarFallback className="bg-primary text-base font-semibold text-primary-foreground sm:text-lg">
                    {getInitials(candidate.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 space-y-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {candidate.name}
                      </h2>
                      <Badge variant="outline">{currentStageName}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="size-4" />
                      <span>{job.title}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <a
                      href={`mailto:${candidate.email}`}
                      className="flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                      <Mail className="size-4" />
                      <span className="truncate">{candidate.email}</span>
                    </a>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>
                          Applied{" "}
                          {formatDistanceToNow(new Date(candidate.createdAt))}{" "}
                          ago
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="size-4" />
                        <span>
                          Updated{" "}
                          {formatDistanceToNow(new Date(candidate.updatedAt))}{" "}
                          ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <Tabs defaultValue="resume" className="gap-0">
            <div className="overflow-x-auto border-b">
              <TabsList className="h-auto min-w-full justify-start rounded-none bg-transparent p-2">
                <TabsTrigger className="shrink-0 px-3 py-2" value="resume">
                  <FileText className="size-4" />
                  Resume
                </TabsTrigger>
                <TabsTrigger className="shrink-0 px-3 py-2" value="answers">
                  <MessageSquare className="size-4" />
                  Answers
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="resume" className="mt-0">
              <SectionHeading
                title="Resume"
                description="Preview the uploaded resume."
              />

              <div className="bg-muted/20 p-2 sm:p-3">
                <div className="overflow-hidden border bg-background">
                  <iframe
                    src={`${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                    className="h-[65svh] min-h-[26rem] w-full border-0"
                    title={`${candidate.name}'s resume`}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="answers" className="mt-0">
              <SectionHeading
                title="Application answers"
                description={`${responseCount} response${responseCount === 1 ? "" : "s"} submitted with this application.`}
              />

              {responses.length === 0 ? (
                <EmptyState
                  title="No answers submitted"
                  description="This candidate did not submit any custom application responses."
                />
              ) : (
                <div className="divide-y">
                  {responses.map((response: any) => (
                    <div
                      key={response.id}
                      className="space-y-2 px-4 py-5 sm:px-6"
                    >
                      <p className="text-sm font-medium">
                        {response.question?.label || response.questionId}
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground whitespace-pre-wrap">
                        {formatAnswer(response.answer)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </Layout>
  );
}
