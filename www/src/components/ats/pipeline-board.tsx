import { StageColumn } from "./stage-column";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { moveApplicantStageFn } from "@/features/services/ats/applicant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EditPipelineDialog } from "./edit-pipeline-dialog";

interface PipelineBoardProps {
  pipeline: any;
  applicants: any[];
  organizationId: string;
}

export function PipelineBoard({
  pipeline,
  applicants,
  organizationId,
}: PipelineBoardProps) {
  const queryClient = useQueryClient();

  const moveMutation = useMutation({
    mutationFn: moveApplicantStageFn,
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Applicant moved successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to move applicant");
    },
  });

  const handleMoveApplicant = (applicantId: string, newStageId: string) => {
    moveMutation.mutate({ data: { applicantId, newStageId } });
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
              applicants={applicants.filter(
                (a) => a.currentStageId === stage.id,
              )}
              onMoveApplicant={handleMoveApplicant}
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
