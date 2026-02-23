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
import { StatusBadge } from "./StatusBadge";
import { Applicant, Status } from "generated/prisma/client";
import {
  ExternalLink,
  Mail,
  Linkedin,
  Twitter,
  Github,
  FileText,
} from "lucide-react";
import { updateApplicantStatusFn } from "@/features/services/applicants/update-status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ApplicantWithJob = Applicant & {
  job: {
    title: string;
    id: string;
  };
};

interface ApplicantProfileProps {
  applicant: ApplicantWithJob | null;
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

export function ApplicantProfile({
  applicant,
  isOpen,
  onClose,
  orgSlug,
}: ApplicantProfileProps) {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (newStatus: Status) =>
      updateApplicantStatusFn({
        data: { id: applicant!.id, status: newStatus },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants", orgSlug] });
      toast.success("Applicant status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  if (!applicant) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <StatusBadge status={applicant.status} />
          </div>
          <div>
            <SheetTitle className="text-2xl font-bold">
              {applicant.name}
            </SheetTitle>
            <SheetDescription className="text-base">
              Applied for{" "}
              <span className="font-medium text-foreground">
                {applicant.job.title}
              </span>
            </SheetDescription>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Status Management */}
          <div className="space-y-3">
            <Label>Move to Status</Label>
            <Select
              value={applicant.status}
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

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact Information
            </h3>
            <div className="grid gap-3">
              <a
                href={`mailto:${applicant.email}`}
                className="flex items-center gap-2 text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="size-4" />
                {applicant.email}
              </a>
              {applicant.linkedIn && (
                <a
                  href={`https://linkedin.com/in/${applicant.linkedIn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="size-4" />
                  LinkedIn Profile
                </a>
              )}
              {applicant.twitter && (
                <a
                  href={`https://twitter.com/${applicant.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="size-4" />
                  Twitter
                </a>
              )}
              {applicant.github && (
                <a
                  href={`https://github.com/${applicant.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              )}
            </div>
          </div>

          <Separator />

          {/* Motivation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Motivation
            </h3>
            <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
              {applicant.motivation || "No motivation provided."}
            </p>
          </div>

          <Separator />

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
                href={`/api/resumes/${applicant.resumeKey}`}
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
