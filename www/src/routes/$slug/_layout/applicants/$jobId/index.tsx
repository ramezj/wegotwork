import { createFileRoute } from "@tanstack/react-router";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getJobByIdFn } from "@/features/services/jobs/get-job";
import { ATSListView } from "@/components/ats/ats-list-view";
import { PipelineBoard } from "@/components/ats/pipeline-board";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, List } from "lucide-react";
import { createPipelineFn } from "@/features/services/ats/pipeline";
import { toast } from "sonner";
import { useState } from "react";
import { CreatePipelineDialog } from "@/components/ats/create-pipeline-dialog";
import { moveApplicantStageFn } from "@/features/services/ats/applicant";
import { linkJobToPipelineFn } from "@/features/services/jobs/link-pipeline";
import { pipelinesQueryOptions } from "@/features/queries/ats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GitBranch as GitBranchIcon } from "lucide-react";

export const Route = createFileRoute("/$slug/_layout/applicants/$jobId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { jobId } = Route.useParams();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"board" | "list">("list");

  const { data } = useSuspenseQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobByIdFn({ data: { jobId } }),
  });

  const createPipelineMutation = useMutation({
    mutationFn: createPipelineFn,
    onSuccess: async (newPipeline) => {
      if (newPipeline?.id) {
        await linkPipelineMutation.mutateAsync({
          data: { jobId, pipelineId: newPipeline.id },
        });
      }
      queryClient.invalidateQueries();
      toast.success("Pipeline created and linked successfully");
    },
  });

  const linkPipelineMutation = useMutation({
    mutationFn: linkJobToPipelineFn,
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Job linked to pipeline successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to link pipeline");
    },
  });

  const { data: pipelinesData } = useSuspenseQuery(
    pipelinesQueryOptions(data?.job?.organizationId || ""),
  );
  const pipelines = pipelinesData || [];

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

  if (!data?.success || !data?.job) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <h3 className="text-lg font-bold">Job not found</h3>
      </div>
    );
  }

  const job = data.job;
  const pipeline = job.pipeline;
  const applicants = job.applicants || [];

  const handleCreateDefaultPipeline = () => {
    createPipelineMutation.mutate({
      data: {
        name: `${job.title} Pipeline`,
        organizationId: job.organizationId,
      },
    });
  };

  if (!pipeline) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 border rounded-lg bg-muted/5 min-h-[500px] text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-8">
          <Plus className="size-8" />
        </div>
        <h3 className="text-2xl font-bold mb-4">No Hiring Pipeline</h3>
        <p className="text-muted-foreground max-w-md mb-10">
          Each job needs a structured pipeline to manage candidates effectively.
          Select an existing pipeline or create a new one.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={handleCreateDefaultPipeline}
            disabled={
              createPipelineMutation.isPending || linkPipelineMutation.isPending
            }
            variant="outline"
          >
            {createPipelineMutation.isPending || linkPipelineMutation.isPending
              ? "Creating..."
              : "Standard Pipeline"}
          </Button>
          <CreatePipelineDialog
            organizationId={job.organizationId}
            trigger={<Button>Create Custom Pipeline</Button>}
          />
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-muted-foreground">
              OR LINK EXISTING
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Select
            onValueChange={(val) =>
              linkPipelineMutation.mutate({ data: { jobId, pipelineId: val } })
            }
            disabled={linkPipelineMutation.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Link existing pipeline" />
            </SelectTrigger>
            <SelectContent>
              {pipelines.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex items-center gap-2">
                    <GitBranchIcon className="size-3.5" />
                    {p.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-end px-2">
        <div className="flex items-center bg-muted/50 p-1 rounded-md">
          <Button
            variant={viewMode === "board" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("board")}
          >
            <LayoutGrid className="size-4 mr-2" /> Board
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="size-4 mr-2" /> List
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {viewMode === "board" ? (
          <PipelineBoard pipeline={pipeline} applicants={applicants} />
        ) : (
          <ATSListView
            pipeline={pipeline}
            applicants={applicants}
            onMoveApplicant={handleMoveApplicant}
            slug={job.organization.slug}
          />
        )}
      </div>
    </div>
  );
}
