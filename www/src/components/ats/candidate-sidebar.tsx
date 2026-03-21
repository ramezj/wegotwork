import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Mail,
  FileText,
  Download,
  ExternalLink,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Candidate, CandidateResponse } from "@/types/candidate";
import { Link } from "@tanstack/react-router";
import { FormFieldConfig } from "@/types/form-config";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CandidateSidebarProps {
  candidate: (Candidate & { responses: CandidateResponse[] }) | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stages: any[];
  slug: string;
  questions: FormFieldConfig[];
  onMoveCandidate: (candidateId: string, newStageId: string) => Promise<void>;
  isMovingCandidate: boolean;
}

export function CandidateSidebar({
  candidate,
  isOpen,
  onOpenChange,
  stages,
  slug,
  questions,
  onMoveCandidate,
  isMovingCandidate,
}: CandidateSidebarProps) {
  if (!candidate) return null;
  const currentStage = stages.find((s) => s.id === candidate.currentStageId);
  const jobId = candidate.jobId;
  const [selectedStageId, setSelectedStageId] = useState(
    candidate.currentStageId || "",
  );

  const canMove =
    !isMovingCandidate &&
    selectedStageId.length > 0 &&
    selectedStageId !== candidate.currentStageId;

  const handleMoveToStage = async () => {
    if (!canMove) return;
    await onMoveCandidate(candidate.id, selectedStageId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        className="sm:max-w-md w-full h-full flex flex-col p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <SheetHeader className="border-b p-4 space-y-2">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-none bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
              {candidate.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <SheetTitle className="text-xl truncate">
                {candidate.name}
              </SheetTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-3.5" />
                <span className="truncate">{candidate.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentStage && <Badge>{currentStage.name}</Badge>}
            <Badge>
              Applied {formatDistanceToNow(new Date(candidate.createdAt))} ago
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-muted-foreground">
                  Move Candidate
                </h3>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Select
                    value={selectedStageId}
                    onValueChange={setSelectedStageId}
                  >
                    <SelectTrigger
                      className="w-full"
                      disabled={isMovingCandidate}
                    >
                      <SelectValue placeholder="Select a stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage: any) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button disabled={!canMove} onClick={handleMoveToStage}>
                    {isMovingCandidate ? "Moving..." : "Move to Stage"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
                  <FileText className="size-4" />
                  Resume
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    className="w-full justify-start gap-2"
                    asChild
                  >
                    <a
                      href={`${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${candidate.resumeKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4" />
                      View Resume
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    asChild
                  >
                    <a
                      href={`${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${candidate.resumeKey}`}
                      download
                    >
                      <Download className="size-4" />
                      Download Resume
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-muted-foreground">
                  Questionnaire Responses
                </h3>
                {candidate.responses.length === 0 ? (
                  <p className="text-muted-foreground italic">
                    No custom questions were answered.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {candidate.responses.map((resp) => {
                      const question = questions.find(
                        (q) => q.id === resp.questionId,
                      );
                      const label = question?.label || resp.questionId;

                      return (
                        <div key={resp.id} className="space-y-2">
                          <p className="font-medium leading-snug">{label}</p>
                          <div className="border p-4">
                            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                              {Array.isArray(resp.answer)
                                ? (resp.answer as string[]).join(", ")
                                : String(resp.answer)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <SheetFooter className="border-t p-4">
            <Button className="w-full gap-2" asChild>
              <Link
                to="/$slug/candidates/$jobId/$candidateId"
                params={{ slug, jobId, candidateId: candidate.id }}
              >
                <User className="size-4" />
                View Full Profile
              </Link>
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
