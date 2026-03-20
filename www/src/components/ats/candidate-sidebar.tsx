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
  Calendar,
  Mail,
  FileText,
  Download,
  ExternalLink,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Candidate, CandidateResponse } from "@/types/candidate";
import { Link } from "@tanstack/react-router";
import { FormFieldConfig } from "@/types/form-config";

interface CandidateSidebarProps {
  candidate: (Candidate & { responses: CandidateResponse[] }) | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stages: any[];
  slug: string;
  questions: FormFieldConfig[];
}

export function CandidateSidebar({
  candidate,
  isOpen,
  onOpenChange,
  stages,
  slug,
  questions,
}: CandidateSidebarProps) {
  if (!candidate) return null;

  const currentStage = stages.find((s) => s.id === candidate.currentStageId);
  const jobId = candidate.jobId;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto flex flex-col">
        <SheetHeader className="border-b p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
              {candidate.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl truncate">
                {candidate.name}
              </SheetTitle>
              <div className="flex items-center gap-2  text-muted-foreground">
                <Mail className="size-3.5" />
                <span className="truncate">{candidate.email}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentStage && (
              <Badge variant="secondary" className="px-2.5 py-0.5">
                {currentStage.name}
              </Badge>
            )}
            <Badge
              variant="outline"
              className="px-2.5 py-0.5 gap-1.5 font-normal"
            >
              <Calendar className="size-3.5 text-muted-foreground" />
              Applied {formatDistanceToNow(new Date(candidate.createdAt))} ago
            </Badge>
          </div>
        </SheetHeader>

        <div className=" px-4 space-y-4 flex-1">
          {/* Resume Section */}
          <div className="space-y-2">
            <h3 className=" font-semibold tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="size-4" />
              Resume
            </h3>
            <div className="flex flex-col space-y-2">
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

          {/* Questionnaire Section */}
          <div className="space-y-2">
            <h3 className=" font-semibold tracking-wider text-muted-foreground">
              Questionnaire Responses
            </h3>
            {candidate.responses.length === 0 ? (
              <p className=" text-muted-foreground italic">
                No custom questions were answered.
              </p>
            ) : (
              <div className="space-y-4">
                {candidate.responses.map((resp) => {
                  const question = questions.find((q) => q.id === resp.questionId);
                  const label = question?.label || resp.questionId;

                  return (
                    <div key={resp.id} className="space-y-2">
                      <p className=" font-medium leading-snug">{label}</p>
                      <div className="p-3 border">
                        <p className=" text-foreground whitespace-pre-wrap leading-relaxed">
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

        <SheetFooter className="border-t">
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
      </SheetContent>
    </Sheet>
  );
}
