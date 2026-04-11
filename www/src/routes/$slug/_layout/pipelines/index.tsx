import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { pipelinesQueryOptions } from "@/features/queries/ats";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Layout } from "@/components/shared/layout";
import { Button } from "@/components/ui/button";
import { Plus, PlusIcon } from "lucide-react";
import { PipelineCard } from "@/components/ats/pipeline-card";

export const Route = createFileRoute("/$slug/_layout/pipelines/")({
  component: PipelinesPage,
  head: () => ({
    meta: [{ title: "Pipelines", content: "Manage hiring pipelines" }],
  }),
});

function PipelinesPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const organizationId = orgData?.organization?.id;

  const { data: pipelines } = useSuspenseQuery(
    pipelinesQueryOptions(organizationId || ""),
  );

  return (
    <Layout
      variant="header"
      title="Hiring Pipelines"
      primaryButton={
        <Button asChild>
          <Link
            to="/$slug/pipelines/create"
            params={{ slug }}
            className="group transition-all"
          >
            Create Pipeline
            <PlusIcon className="duration-300 group-hover:rotate-90" />
          </Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pipelines?.map((pipeline: any) => (
          <PipelineCard
            key={pipeline.id}
            pipeline={pipeline}
            onOpen={() =>
              navigate({
                to: "/$slug/pipelines/$pipelineId",
                params: { slug, pipelineId: pipeline.id },
              })
            }
          />
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
            <Button asChild className="mt-6">
              <Link to="/$slug/pipelines/create" params={{ slug }}>
                Create Pipeline
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
