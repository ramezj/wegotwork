import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { Applicant } from "generated/prisma/client";
import { Button } from "@/components/ui/button";
import { ChevronRight, Mail, Calendar, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ApplicantWithJob = Applicant & {
  job: {
    title: string;
    id: string;
  };
};

interface ApplicantListProps {
  applicants: ApplicantWithJob[];
  onViewApplicant: (applicant: ApplicantWithJob) => void;
}

export function ApplicantList({
  applicants,
  onViewApplicant,
}: ApplicantListProps) {
  if (applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/5">
        <div className="size-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Briefcase className="size-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No applications yet</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">
          When candidates apply to your jobs, they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applicants.map((applicant) => (
        <Card
          key={applicant.id}
          className="group hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
          onClick={() => onViewApplicant(applicant)}
        >
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-center p-5 gap-4">
              {/* Avatar / Initial Placeholder */}
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {applicant.name.charAt(0).toUpperCase()}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg truncate">
                    {applicant.name}
                  </h3>
                  <div className="sm:hidden">
                    <StatusBadge status={applicant.status} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Briefcase className="size-3.5 shrink-0" />
                    <span className="truncate">{applicant.job.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Mail className="size-3.5" />
                    <span>{applicant.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar className="size-3.5" />
                    <span>
                      {format(new Date(applicant.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                <div className="hidden sm:block">
                  <StatusBadge status={applicant.status} />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full group-hover:bg-primary/10"
                >
                  <ChevronRight className="size-5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
