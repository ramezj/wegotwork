import { createFileRoute } from "@tanstack/react-router";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { pipelinesQueryOptions } from "@/features/queries/ats";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Layout } from "@/components/shared/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranch, Trash2, Plus, MoreVertical, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletePipelineFn } from "@/features/services/ats/pipeline";
import { toast } from "sonner";
import { CreatePipelineDialog } from "@/components/ats/create-pipeline-dialog";
import { EditPipelineDialog } from "@/components/ats/edit-pipeline-dialog";

export const Route = createFileRoute("/$slug/_layout/pipelines/")({
  component: PipelinesPage,
});

function PipelinesPage() {
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();

  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const organizationId = orgData?.organization?.id;

  const { data: pipelines } = useSuspenseQuery(
    pipelinesQueryOptions(organizationId || ""),
  );

  const deleteMutation = useMutation({
    mutationFn: deletePipelineFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pipelines", organizationId],
      });
      toast.success("Pipeline deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete pipeline");
    },
  });

  return (
    <Layout
      title="Hiring Pipelines"
      primaryButton={
        <CreatePipelineDialog organizationId={organizationId || ""} />
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pipelines?.map((pipeline: any) => (
          <Card key={pipeline.id} className="group overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="size-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground mb-4">
                  <GitBranch className="size-5" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditPipelineDialog
                      pipeline={pipeline}
                      organizationId={organizationId || ""}
                      trigger={
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          <Settings2 className="size-4" /> Edit
                        </DropdownMenuItem>
                      }
                    />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this pipeline?",
                          )
                        ) {
                          deleteMutation.mutate({ data: { id: pipeline.id } });
                        }
                      }}
                    >
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-lg">{pipeline.name}</CardTitle>
              <CardDescription>
                {pipeline.stages?.length || 0} Hiring Stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {pipeline.stages?.slice(0, 3).map((stage: any, idx: number) => (
                  <div
                    key={stage.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm"
                  >
                    <span className="text-muted-foreground text-xs">
                      {idx + 1}.
                    </span>
                    <span className="truncate">{stage.name}</span>
                  </div>
                ))}
                {pipeline.stages?.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2 pt-1">
                    +{pipeline.stages.length - 3} more stages
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {pipelines?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6">
              <Plus className="size-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">No pipelines yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Create your first hiring pipeline to start managing candidates
              effectively.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
