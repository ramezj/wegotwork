import { createFileRoute } from "@tanstack/react-router";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getJobByIdFn } from "@/features/services/jobs/get-job";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { createPipelineFn } from "@/features/services/ats/pipeline";
import { toast } from "sonner";
import { useState } from "react";
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
import { Layout } from "@/components/shared/layout";
import { ApplicantCard } from "@/components/ats/applicant-card";

export const Route = createFileRoute("/$slug/_layout/applicants/$jobId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { jobId, slug } = Route.useParams();
  const queryClient = useQueryClient();
  const [activeStageId, setActiveStageId] = useState<string>("all");

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
        <h3 className="text-lg font-bold text-muted-foreground italic">
          Job not found
        </h3>
      </div>
    );
  }

  const job = data.job;
  const pipeline = job.pipeline;
  const stages = pipeline?.stages || [];
  const applicants = job.applicants || [];

  const filteredApplicants =
    activeStageId === "all"
      ? applicants
      : applicants.filter((a: any) => a.currentStageId === activeStageId);

  const handleLinkExisting = (val: string) => {
    linkPipelineMutation.mutate({
      data: { jobId, pipelineId: val },
    });
  };

  const handleCreateDefaultPipeline = () => {
    createPipelineMutation.mutate({
      data: {
        name: `${job.title} Pipeline`,
        organizationId: job.organizationId,
      },
    });
  };

  return (
    <Layout title={job.title}>
      <div className="flex flex-col gap-8 pb-12">
        {/* Header / Actions Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Applicants</h2>
            <p className="text-muted-foreground text-sm">
              Manage and track candidates for this position
            </p>
          </div>

          {!pipeline ? (
            <div className="flex items-center gap-3">
              <Select onValueChange={handleLinkExisting}>
                <SelectTrigger className="w-[200px] h-9 text-xs">
                  <SelectValue placeholder="Link Pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {pipelines.map((p: any) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleCreateDefaultPipeline}
                disabled={createPipelineMutation.isPending}
                className="h-9 px-4"
              >
                {createPipelineMutation.isPending ? "..." : "Auto Pipeline"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border/50">
              <Button
                variant={activeStageId === "all" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveStageId("all")}
                className="h-8 text-xs font-medium"
              >
                All
                <Badge
                  variant="outline"
                  className="ml-2 px-1 opacity-50 border-none bg-transparent"
                >
                  {applicants.length}
                </Badge>
              </Button>
              {stages.map((stage: any) => (
                <Button
                  key={stage.id}
                  variant={activeStageId === stage.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveStageId(stage.id)}
                  className="h-8 text-xs font-medium"
                >
                  {stage.name}
                  <Badge
                    variant="outline"
                    className="ml-2 px-1 opacity-50 border-none bg-transparent"
                  >
                    {
                      applicants.filter(
                        (a: any) => a.currentStageId === stage.id,
                      ).length
                    }
                  </Badge>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Applicants Grid */}
        {filteredApplicants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredApplicants.map((applicant: any) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                stages={stages}
                onMove={handleMoveApplicant}
                slug={slug}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed rounded-2xl bg-muted/5 text-center">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="size-6 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-semibold">No candidates yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs mt-1">
              {activeStageId === "all"
                ? "Once people apply, they will show up here for you to review."
                : "There are current no applicants in this specific stage."}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
