import { Calendar, MoreHorizontal, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";
import { type ATSCandidate } from "./types";
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
  candidate: ATSCandidate;
  stages: any[];
  slug: string;
  onMove: (candidateId: string, newStageId: string) => void;
  onSelect: (candidate: ATSCandidate) => void;
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
  candidate,
  stages,
  slug,
  onMove,
  onSelect,
}: CandidateCardProps) {
  const jobId = candidate.jobId || "";
  const currentStage = stages.find((s) => s.id === candidate.currentStageId);
  const initials = getInitials(candidate.name);

  return (
    <Card
      onClick={() => onSelect(candidate)}
      className="relative w-full group bg-secondary hover:bg-muted/50 transition-all duration-150 flex flex-row items-center p-4 cursor-pointer gap-4 overflow-hidden"
    >
      {/* Avatar */}
      <div
        className={`size-10 rounded-lg flex items-center justify-center font-semibold text-sm shrink-0 bg-primary text-primary-foreground`}
      >
        {initials}
      </div>

      {/* Name + meta */}
      <div className="flex flex-1 flex-col min-w-0 gap-1.5">
        <p className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
          {candidate.name}
        </p>
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Badge>
            {/* <Mail className="size-2.5 opacity-70" /> */}
            <span className="truncate max-w-[120px]">{candidate.email}</span>
          </Badge>
          {currentStage && <Badge>{currentStage.name}</Badge>}
          {/* <Badge>
            <Calendar className="size-2.5" />
            {formatDistanceToNow(new Date(candidate.createdAt))} ago
          </Badge> */}
        </div>
      </div>

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
                to="/$slug/candidates/$jobId/$candidateId"
                params={{ slug, jobId, candidateId: candidate.id }}
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
                      disabled={stage.id === candidate.currentStageId}
                      onClick={() => onMove(candidate.id, stage.id)}
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
