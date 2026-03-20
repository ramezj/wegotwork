import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CandidateStatusBadge } from "./CandidateStatusBadge";
import type { Candidate, Status, CandidateResponse } from "generated/prisma/client";
import { ExternalLink, Mail, FileText } from "lucide-react";
import { updateCandidateStatusFn } from "@/features/services/candidates/update-status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type CandidateWithJob = Candidate & {
  job: {
    title: string;
    id: string;
    formConfig: any; // FormConfig
  };
  responses: (CandidateResponse & { question: any })[];
};

interface CandidateSheetProfileProps {
  candidate: CandidateWithJob | null;
  isOpen: boolean;
  onClose: () => void;
  orgSlug: string;
}

const statuses: { value: Status; label: string }[] = [
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDERREVIEW", label: "Under Review" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
  { value: "HIRED", label: "Hired" },
];

export function CandidateSheetProfile({
  candidate,
  isOpen,
  onClose,
  orgSlug,
}: CandidateSheetProfileProps) {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (newStatus: Status) =>
      updateCandidateStatusFn({
        data: { id: candidate!.id, status: newStatus },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates", orgSlug] });
      toast.success("Candidate status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  if (!candidate) return null;

  const responses = candidate.responses || [];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CandidateStatusBadge status={candidate.status} />
          </div>
          <div>
            <SheetTitle className="text-2xl font-bold">
              {candidate.name}
            </SheetTitle>
            <SheetDescription className="text-base">
              Applied for{" "}
              <span className="font-medium text-foreground">
                {candidate.job.title}
              </span>
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Status Management */}
          <div className="space-y-3">
            <Label>Move to Status</Label>
            <Select
              value={candidate.status}
              onValueChange={(value) => updateStatus(value as Status)}
              disabled={isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Core Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Information
            </h3>
            <div className="grid gap-3">
              <a
                href={`mailto:${candidate.email}`}
                className="flex items-center gap-2 text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="size-4" />
                {candidate.email}
              </a>
            </div>
          </div>

          <Separator />

          {/* Dynamic Responses */}
          {responses.length > 0 && (
            <>
              <div className="space-y-6">
                {responses.map((resp) => {
                  const question = resp.question;
                  if (!question) return null;

                  const answerValue = resp.answer as string;
                  if (!answerValue) return null;

                  return (
                    <div key={resp.id} className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {question.label}
                      </h3>
                      {question.type === "LONG_ANSWER" ? (
                        <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                          {answerValue}
                        </p>
                      ) : question.type === "CHECKBOX" ? (
                        <p className="text-sm text-foreground/80">
                          {answerValue === "true" ? "Yes" : "No"}
                        </p>
                      ) : question.type === "MULTI_SELECT" ? (
                        <div className="flex flex-wrap gap-1">
                          {answerValue.split(",").map((v) => (
                            <Badge key={v} variant="secondary">
                              {v}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-foreground/80">{answerValue}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              <Separator />
            </>
          )}

          {/* Resume */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Documents
            </h3>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              asChild
            >
              <a
                href={`/api/resumes/${candidate.resumeKey}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="size-4" />
                View Resume
                <ExternalLink className="ml-auto size-3 opacity-50" />
              </a>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
