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
import { Applicant } from "@/types/applicant";
import { Link } from "@tanstack/react-router";
import { FormFieldConfig } from "@/types/form-config";

interface ApplicantSidebarProps {
  applicant: Applicant | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stages: any[];
  slug: string;
  questions: FormFieldConfig[];
}

export function ApplicantSidebar({
  applicant,
  isOpen,
  onOpenChange,
  stages,
  slug,
  questions,
}: ApplicantSidebarProps) {
  if (!applicant) return null;

  const currentStage = stages.find((s) => s.id === applicant.currentStageId);
  const jobId = applicant.jobId;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto flex flex-col">
        <SheetHeader className="border-b p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
              {applicant.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl truncate">
                {applicant.name}
              </SheetTitle>
              <div className="flex items-center gap-2  text-muted-foreground">
                <Mail className="size-3.5" />
                <span className="truncate">{applicant.email}</span>
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
              Applied {formatDistanceToNow(new Date(applicant.createdAt))} ago
            </Badge>
          </div>
        </SheetHeader>

        <div className=" px-4 space-y-4 flex-1">
          {/* Resume Section */}
          <div className="space-y-2">
            <h3 className=" font-semibold  tracking-wider text-muted-foreground flex items-center gap-2">
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
                  href={`${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${applicant.resumeKey}`}
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
                  href={`${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${applicant.resumeKey}`}
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
            {Object.keys((applicant.responses as object) || {}).length === 0 ? (
              <p className=" text-muted-foreground italic">
                No custom questions were answered.
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(applicant.responses as Record<string, any>).map(
                  ([questionId, answer]) => {
                    const question = questions.find((q) => q.id === questionId);
                    const label = question?.label || questionId;

                    return (
                      <div key={questionId} className="space-y-2">
                        <p className=" font-medium leading-snug">{label}</p>
                        <div className="p-3 border">
                          <p className=" text-foreground whitespace-pre-wrap leading-relaxed">
                            {Array.isArray(answer)
                              ? answer.join(", ")
                              : String(answer)}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="border-t">
          <Button className="w-full gap-2" asChild>
            <Link
              to="/$slug/candidates/$jobId/$applicantId"
              params={{ slug, jobId, applicantId: applicant.id }}
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
