import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Calendar,
  MoreHorizontal,
  User,
  ChevronRight,
  XCircle,
} from "lucide-react";
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
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";

interface ApplicantCardProps {
  applicant: any;
  onMove: (applicantId: string, newStageId: string) => void;
  stages: any[];
  slug: string;
}

export function ApplicantCard({
  applicant,
  onMove,
  stages,
  slug,
}: ApplicantCardProps) {
  const jobId = applicant.jobId || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to="/$slug/applicants/$jobId/$applicantId"
        params={{ slug, jobId, applicantId: applicant.id }}
        className="block group"
      >
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">{applicant.name}</h4>
                <div className="flex items-center text-xs text-muted-foreground gap-1.5">
                  <Mail className="size-3" />
                  <span className="truncate max-w-[150px]">
                    {applicant.email}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuItem className="text-xs">
                    <User className="size-4 mr-2" /> View Profile
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">
                      <ChevronRight className="size-4 mr-2" /> Move to Stage
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {stages.map((stage) => (
                        <DropdownMenuItem
                          key={stage.id}
                          disabled={stage.id === applicant.currentStageId}
                          onClick={() => onMove(applicant.id, stage.id)}
                          className="text-xs"
                        >
                          {stage.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuItem className="text-xs text-destructive">
                    <XCircle className="size-4 mr-2" /> Reject Candidate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Calendar className="size-3" />
                <span>
                  {formatDistanceToNow(new Date(applicant.createdAt))} ago
                </span>
              </div>

              <div className="flex gap-2">
                {applicant.evaluations?.length > 0 && (
                  <Badge variant="secondary" className="px-1.5 h-4 text-[9px]">
                    {applicant.evaluations.length} Reviews
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
