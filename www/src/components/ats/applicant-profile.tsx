import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  MessageSquare,
  History,
  Star,
  User,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { EvaluationForm } from "./evaluation-form";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApplicantProfileProps {
  applicant: any;
  history: any;
}

export function ApplicantProfile({
  applicant,
  history,
}: ApplicantProfileProps) {
  const evaluations = history?.evaluations || [];
  const activityLogs = history?.activityLogs || [];

  const averageScore =
    evaluations.length > 0
      ? evaluations.reduce((sum: number, e: any) => sum + e.score, 0) /
        evaluations.length
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Left Column: Essential Info */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="rounded-3xl border shadow-sm overflow-hidden">
          <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
            <Avatar className="size-24 rounded-2xl shadow-xl shadow-primary/10">
              <AvatarImage src={applicant.image} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                {applicant.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {applicant.name}
              </h2>
              <p className="text-muted-foreground font-medium">
                {applicant.job?.title}
              </p>
            </div>

            <div className="w-full pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/30 p-3 rounded-xl">
                <Mail className="size-4 text-primary" />
                <span className="truncate">{applicant.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground bg-muted/30 p-3 rounded-xl">
                <Calendar className="size-4 text-primary" />
                <span>
                  Applied {formatDistanceToNow(new Date(applicant.createdAt))}{" "}
                  ago
                </span>
              </div>
            </div>

            <div className="w-full pt-4 flex gap-2">
              <Button
                className="flex-1 font-bold h-11 rounded-xl shadow-lg border-none"
                variant="default"
              >
                Resume
              </Button>
              <Button
                className="flex-1 font-bold h-11 rounded-xl"
                variant="outline"
              >
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none bg-primary/5 shadow-none overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold tracking-tight uppercase text-primary/70">
              Process Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Current Stage</span>
              <Badge
                variant="default"
                className="rounded-lg h-7 px-3 shadow-sm"
              >
                {applicant.currentStage?.name || "Submitted"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">Avg. Score</span>
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <Star className="size-4 fill-current" />
                <span className="text-lg">{averageScore.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground/60">/ 5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Timeline & Evaluations */}
      <div className="lg:col-span-2 space-y-6">
        <Tabs defaultValue="timeline" className="w-full h-full">
          <TabsList className="bg-muted/50 p-1.5 rounded-2xl h-14 w-full justify-start gap-2 border">
            <TabsTrigger
              value="timeline"
              className="rounded-xl px-6 font-bold flex items-center gap-2 data-[state=active]:shadow-lg"
            >
              <History className="size-4" /> Timeline
            </TabsTrigger>
            <TabsTrigger
              value="evaluation"
              className="rounded-xl px-6 font-bold flex items-center gap-2 data-[state=active]:shadow-lg"
            >
              <Star className="size-4" /> Evaluations
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="rounded-xl px-6 font-bold flex items-center gap-2 data-[state=active]:shadow-lg"
            >
              <MessageSquare className="size-4" /> Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-6">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/20 before:to-transparent">
                {activityLogs.map((log: any, i: number) => (
                  <div key={log.id} className="relative pl-12 group">
                    <div className="absolute left-0 top-1 size-10 rounded-xl bg-background border-2 border-primary/20 flex items-center justify-center text-primary shadow-sm group-hover:border-primary transition-all">
                      {log.action === "MOVED_STAGE" ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <Star className="size-5" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">
                          {log.action.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase">
                          {format(new Date(log.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {log.action === "MOVED_STAGE" ? (
                          <>
                            Moved from{" "}
                            <span className="text-foreground font-bold">
                              {log.metadata.from}
                            </span>{" "}
                            to{" "}
                            <span className="text-foreground font-bold">
                              {log.metadata.to}
                            </span>
                          </>
                        ) : (
                          <>
                            Added evaluation for{" "}
                            <span className="text-foreground font-bold">
                              {log.metadata.stage}
                            </span>{" "}
                            with score{" "}
                            <span className="text-primary font-bold">
                              {log.metadata.score}/5
                            </span>
                          </>
                        )}
                      </p>
                      {log.actor && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <Avatar className="size-5 border">
                            <AvatarImage src={log.actor.image} />
                            <AvatarFallback className="text-[8px]">
                              {log.actor.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[10px] font-bold text-muted-foreground">
                            Action by {log.actor.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="evaluation" className="mt-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {evaluations.map((evalItem: any) => (
                <Card
                  key={evalItem.id}
                  className="rounded-2xl border bg-muted/10 shadow-sm"
                >
                  <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-muted-foreground uppercase">
                        {evalItem.stage.name}
                      </p>
                      <CardTitle className="text-lg font-bold">
                        {evalItem.interviewer.name}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1 text-primary font-bold bg-primary/10 px-2 py-1 rounded-lg">
                      <Star className="size-4 fill-current" />
                      {evalItem.score}
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-2">
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
                      "{evalItem.feedback || "No feedback provided."}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 shadow-none overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  Add Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <EvaluationForm
                  applicantId={applicant.id}
                  stageId={applicant.currentStageId}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            {/* Communication placeholder */}
            <div className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed rounded-3xl opacity-50">
              <MessageSquare className="size-12 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-bold">No Messages Yet</h3>
              <p className="text-sm font-medium text-muted-foreground">
                Start communicating with the candidate directly from the Ark.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
