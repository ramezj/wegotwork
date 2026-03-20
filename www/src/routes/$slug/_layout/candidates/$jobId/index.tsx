import { createFileRoute } from "@tanstack/react-router";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getJobByIdFn } from "@/features/services/jobs/get-job";
import { createPipelineFn } from "@/features/services/ats/pipeline";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ATSListView } from "@/components/ats/ats-list-view";

export const Route = createFileRoute("/$slug/_layout/candidates/$jobId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { jobId, slug } = Route.useParams();
  const queryClient = useQueryClient();

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
      <Layout title="Job Not Found">
        <div className="flex items-center justify-center min-h-[400px]">
          <h3 className="text-lg font-bold text-muted-foreground italic">
            Job not found
          </h3>
        </div>
      </Layout>
    );
  }

  const job = data.job;
  const pipeline = job.pipeline;
  const applicants = job.applicants || [];

  const handleLinkExisting = (val: string) => {
    linkPipelineMutation.mutate({
      data: { jobId, pipelineId: val },
    });
  };

  const handleCreateDefaultPipeline = () => {
    createPipelineMutation.mutate({
      data: {
        organizationId: job.organizationId,
      },
    });
  };

  return (
    <main className="flex flex-1 flex-col space-y-4 p-4 min-h-0">
      {!pipeline ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed rounded-3xl bg-muted/5 text-center max-w-2xl mx-auto my-12">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Plus className="size-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            Setup Hiring Pipeline
          </h3>
          <p className="text-muted-foreground text-base max-w-sm mt-2 mb-8">
            Each job needs a pipeline to manage its candidates. Choose an
            existing one or create a new one automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Select onValueChange={handleLinkExisting}>
              <SelectTrigger className="w-full sm:w-[220px] h-11">
                <SelectValue placeholder="Link Existing Pipeline" />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-widest hidden sm:block">
              Or
            </div>
            <Button
              size="lg"
              onClick={handleCreateDefaultPipeline}
              disabled={createPipelineMutation.isPending}
              className="w-full sm:w-auto h-11 px-8"
            >
              {createPipelineMutation.isPending
                ? "Creating..."
                : "Create Auto Pipeline"}
            </Button>
          </div>
        </div>
      ) : (
        <ATSListView
          pipeline={pipeline}
          applicants={applicants}
          onMoveApplicant={handleMoveApplicant}
          slug={slug}
          organizationId={job.organizationId}
          jobName={job.title}
          questions={(job.questions as any) || []}
        />
      )}
    </main>
  );
}
