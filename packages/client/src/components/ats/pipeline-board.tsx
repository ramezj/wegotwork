import { StageColumn } from "./stage-column";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { moveCandidateStageFn } from "@/features/services/ats/candidate";
import { Link } from "@tanstack/react-router";

interface PipelineBoardProps {
  pipeline: any;
  candidates: any[];
  slug: string;
}

export function PipelineBoard({
  pipeline,
  candidates,
  slug,
}: PipelineBoardProps) {
  const queryClient = useQueryClient();

  const moveMutation = useMutation({
    mutationFn: moveCandidateStageFn,
    onSuccess: () => {
      // Candidate moves impact any views that read candidates/pipelines.
      // Be specific to avoid refetching the entire app cache.
      queryClient.invalidateQueries({ queryKey: ["job"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
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
        <Button variant="outline" asChild>
          <Link
            to="/$slug/pipelines/$pipelineId"
            params={{ slug, pipelineId: pipeline.id }}
          >
            Edit Pipeline
          </Link>
        </Button>
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

          <Button
            variant="outline"
            className="w-72 min-w-72 h-full border-2 border-dashed flex flex-col items-center justify-center gap-2"
            asChild
          >
            <Link
              to="/$slug/pipelines/$pipelineId"
              params={{ slug, pipelineId: pipeline.id }}
            >
              <Plus className="size-6 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">
                Add New Stage
              </span>
            </Link>
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
