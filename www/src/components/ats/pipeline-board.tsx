import { StageColumn } from "./stage-column";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditPipelineDialog } from "./edit-pipeline-dialog";
import { moveCandidateStageFn } from "@/features/services/ats/candidate";

interface PipelineBoardProps {
  pipeline: any;
  candidates: any[];
  organizationId: string;
}

export function PipelineBoard({
  pipeline,
  candidates,
  organizationId,
}: PipelineBoardProps) {
  const queryClient = useQueryClient();

  const moveMutation = useMutation({
    mutationFn: moveCandidateStageFn,
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Candidate moved successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to move candidate");
    },
  });

  const handleMoveCandidate = (candidateId: string, newStageId: string) => {
    moveMutation.mutate({ data: { candidateId, newStageId } });
  };

  const stages = pipeline.stages || [];

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] w-full gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold tracking-tight">Hiring Pipeline</h2>
        <EditPipelineDialog
          pipeline={pipeline}
          organizationId={organizationId}
        />
      </div>

      <ScrollArea className="flex-1 w-full whitespace-nowrap">
        <div className="flex gap-4 h-full pb-4">
          {stages.map((stage: any) => (
            <StageColumn
              key={stage.id}
              stage={stage}
              allStages={stages}
              candidates={candidates.filter(
                (c) => c.currentStageId === stage.id,
              )}
              onMoveCandidate={handleMoveCandidate}
            />
          ))}

          <EditPipelineDialog
            pipeline={pipeline}
            organizationId={organizationId}
            trigger={
              <Button
                variant="outline"
                className="w-72 min-w-72 h-full border-2 border-dashed flex flex-col items-center justify-center gap-2"
              >
                <Plus className="size-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-medium">
                  Add New Stage
                </span>
              </Button>
            }
          />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
