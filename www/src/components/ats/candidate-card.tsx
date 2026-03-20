import { Calendar, MoreHorizontal, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";
import { Applicant } from "@/types/applicant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CandidateCardProps {
  applicant: Applicant;
  stages: any[];
  slug: string;
  onMove: (applicantId: string, newStageId: string) => void;
  onSelect: (applicant: Applicant) => void;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CandidateCard({
  applicant,
  stages,
  slug,
  onMove,
  onSelect,
}: CandidateCardProps) {
  const jobId = applicant.jobId || "";
  const currentStage = stages.find((s) => s.id === applicant.currentStageId);
  const initials = getInitials(applicant.name);

  return (
    <Card 
      onClick={() => onSelect(applicant)}
      className="relative w-full group bg-card hover:bg-muted/50 transition-all duration-150 flex flex-row items-center p-4 cursor-pointer gap-4 overflow-hidden"
    >
      {/* Full-row invisible link overlay */}
      {/* <Link
        to="/$slug/candidates/$jobId/$applicantId"
        params={{ slug, jobId, applicantId: applicant.id }}
        className="absolute inset-0"
        aria-label={`View ${applicant.name}'s profile`}
      /> */}

      {/* Avatar */}
      <div
        className={`size-10 rounded-lg flex items-center justify-center font-semibold text-sm shrink-0 bg-primary text-primary-foreground`}
      >
        {initials}
      </div>

      {/* Name + meta */}
      <div className="flex flex-1 flex-col min-w-0 gap-1.5">
        <p className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
          {applicant.name}
        </p>
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Badge variant="outline" className="gap-1 font-normal py-0 px-2 h-5 text-[10px] border-muted-foreground/20">
            <Mail className="size-2.5 opacity-70" />
            <span className="truncate max-w-[120px]">
              {applicant.email}
            </span>
          </Badge>
          {/*<Badge variant="secondary" className="gap-1 font-normal">
            <Mail className="size-3 opacity-70" />
            <span className="truncate max-w-[180px] sm:max-w-none">
              {applicant.email}
            </span>
          </Badge>*/}
          {currentStage && (
            <Badge variant="secondary">{currentStage.name}</Badge>
          )}
          <Badge variant="secondary">
            <Calendar />
            {formatDistanceToNow(new Date(applicant.createdAt))} ago
          </Badge>
        </div>
      </div>

      {/* View Profile button — sm+ */}
      {/*<div className="relative z-10 hidden sm:block shrink-0">
        <Button variant="outline" size="sm" className="gap-1.5">
          View Profile
          <ArrowRight className="size-3.5 duration-150 group-hover:-rotate-45" />
        </Button>
      </div>*/}

      {/* Arrow — mobile only */}
      {/*<div className="relative z-10 sm:hidden shrink-0">
        <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:-rotate-45 transition-all duration-150" />
      </div>*/}

      {/* Actions dropdown — sits above link overlay */}
      <div 
        className="relative z-10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
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
                to="/$slug/candidates/$jobId/$applicantId"
                params={{ slug, jobId, applicantId: applicant.id }}
                className="flex items-center cursor-pointer"
              >
                <User className="size-4 mr-2 opacity-70" />
                View Profile
              </Link>
            </DropdownMenuItem>
            {stages.length > 0 && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <MoreHorizontal className="size-4 mr-2 opacity-70" />
                  Move to Stage
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {stages.map((stage: any) => (
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
    </Card>
  );
}
