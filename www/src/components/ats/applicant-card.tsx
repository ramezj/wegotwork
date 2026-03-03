import { Card, CardContent } from "@/components/ui/card";
import { Mail, Calendar, MoreHorizontal, User, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";

interface ApplicantCardProps {
  applicant: any;
  onMove?: (applicantId: string, newStageId: string) => void;
  stages?: any[];
  slug: string;
}

export function ApplicantCard({
  applicant,
  onMove,
  stages = [],
  slug,
}: ApplicantCardProps) {
  const jobId = applicant.jobId || "";
  const currentStage = stages.find((s) => s.id === applicant.currentStageId);

  return (
    <Card className="group relative overflow-hidden hover:border-primary/40 transition-all duration-200 shadow-sm border-muted">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground shrink-0 border border-border">
              <User2 className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                to="/$slug/applicants/$jobId/$applicantId"
                params={{ slug, jobId, applicantId: applicant.id }}
                className="font-semibold text-[0.95rem] hover:underline underline-offset-4 decoration-muted-foreground/30 truncate block"
              >
                {applicant.name}
              </Link>
              <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1.5">
                <Mail className="size-3 shrink-0 opacity-70" />
                <span className="truncate">{applicant.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-1">
            {currentStage && (
              <Badge
                variant="outline"
                className="h-6 px-2 text-[10px] font-medium bg-secondary/30 border-secondary-foreground/10 text-secondary-foreground/80"
              >
                {currentStage.name}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 hover:bg-muted"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    to="/$slug/applicants/$jobId/$applicantId"
                    params={{ slug, jobId, applicantId: applicant.id }}
                    className="flex items-center cursor-pointer"
                  >
                    <User className="size-4 mr-2 opacity-70" /> View Profile
                  </Link>
                </DropdownMenuItem>

                {stages.length > 0 && onMove && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <MoreHorizontal className="size-4 mr-2 opacity-70" /> Move
                      to Stage
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {stages.map((stage) => (
                        <DropdownMenuItem
                          key={stage.id}
                          disabled={stage.id === applicant.currentStageId}
                          onClick={() => onMove(applicant.id, stage.id)}
                        >
                          {stage.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider opacity-60">
            <Calendar className="size-3" />
            <span>
              Applied {formatDistanceToNow(new Date(applicant.createdAt))} ago
            </span>
          </div>

          <div className="flex gap-2">
            {applicant.evaluations?.length > 0 && (
              <Badge
                variant="secondary"
                className="px-2 h-5 text-[9px] font-bold bg-primary/5 text-primary border-transparent"
              >
                {applicant.evaluations.length} EVALUATIONS
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
