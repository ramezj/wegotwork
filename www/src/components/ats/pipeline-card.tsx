import {
  BriefcaseBusiness,
  GitBranch,
  ListTree,
} from "lucide-react";

type PipelineCardPipeline = {
  id: string;
  name: string;
  jobs?: { id: string }[];
  stages?: { id: string; name: string }[];
};

export function PipelineCard({
  pipeline,
  onOpen,
}: {
  pipeline: PipelineCardPipeline;
  onOpen: () => void;
}) {
  const stages = pipeline.stages ?? [];
  const linkedJobs = pipeline.jobs?.length ?? 0;
  return (
    <div
      className="group cursor-pointer border bg-background p-5 transition-colors hover:bg-muted/30"
      onClick={onOpen}
    >
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center border bg-muted/50 text-foreground">
            <GitBranch className="size-5" />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-lg font-semibold tracking-tight">
              {pipeline.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {linkedJobs > 0
                ? `${linkedJobs} linked job${linkedJobs === 1 ? "" : "s"}`
                : "No jobs linked yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="border bg-muted/20 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <BriefcaseBusiness className="size-3.5" />
            Linked Jobs
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {linkedJobs}
          </p>
        </div>

        <div className="border bg-muted/20 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ListTree className="size-3.5" />
            Pipeline Stages
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {stages.length}
          </p>
        </div>
      </div>
    </div>
  );
}
