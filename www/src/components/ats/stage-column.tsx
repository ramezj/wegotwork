import { ApplicantCard } from "./applicant-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StageColumnProps {
  stage: any;
  applicants: any[];
  onMoveApplicant: (applicantId: string, newStageId: string) => void;
  allStages: any[];
  slug?: string;
}

export function StageColumn({
  stage,
  applicants,
  onMoveApplicant,
  allStages,
  slug = "",
}: StageColumnProps) {
  return (
    <div className="flex flex-col w-72 min-w-72 h-full bg-muted/50 rounded-lg border flex-shrink-0">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm truncate max-w-[180px]">
            {stage.name}
          </h3>
          <Badge variant="secondary" className="px-1.5 h-4 text-[10px]">
            {applicants.length}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="flex flex-col gap-2 pb-4">
          {applicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onMove={onMoveApplicant}
              stages={allStages}
              slug={slug}
            />
          ))}

          {applicants.length === 0 && (
            <div className="py-8 text-center border-2 border-dashed rounded-lg opacity-50">
              <p className="text-[10px] text-muted-foreground">No candidates</p>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full mt-2 border-dashed border-2 text-xs"
            size="sm"
          >
            <Plus className="size-3 mr-1" /> Add Candidate
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
