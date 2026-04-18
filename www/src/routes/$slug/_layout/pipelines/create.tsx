import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Layout } from "@/components/shared/layout";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { createPipelineFn } from "@/features/services/ats/pipeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDown,
  ArrowUp,
  Check,
  GitBranch,
  Loader,
  Plus,
  X,
} from "lucide-react";

const CREATE_PIPELINE_FORM_ID = "create-pipeline-form";
const DEFAULT_STAGE_NAMES = ["Applied", "Screen", "Interview", "Offer"];
const SUGGESTED_STAGE_NAMES = [
  "Applied",
  "Screen",
  "Take-home",
  "Interview",
  "Final interview",
  "Offer",
];

const pipelineSchema = z.object({
  name: z.string().min(1, "Pipeline name is required"),
  stages: z
    .array(
      z.object({
        name: z.string().min(1, "Stage name is required"),
      }),
    )
    .min(1, "At least one stage is required"),
});

type PipelineFormValues = z.infer<typeof pipelineSchema>;

function buildDefaultStages() {
  return DEFAULT_STAGE_NAMES.map((name) => ({ name }));
}

function buildSuggestedStages() {
  return SUGGESTED_STAGE_NAMES.map((name) => ({ name }));
}

function formatStageCount(count: number) {
  return `${count} stage${count === 1 ? "" : "s"}`;
}

export const Route = createFileRoute("/$slug/_layout/pipelines/create")({
  component: CreatePipelinePage,
});

function CreatePipelinePage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );

  const form = useForm<PipelineFormValues>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      name: "",
      stages: buildDefaultStages(),
    },
  });

  const { fields, append, remove, move, replace } = useFieldArray({
    control: form.control,
    name: "stages",
  });

  const watchedStages = form.watch("stages") ?? [];

  const createMutation = useMutation({
    mutationFn: createPipelineFn,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["pipelines", slug],
      });
      toast.success("Pipeline created successfully");
      navigate({ to: "/$slug/pipelines", params: { slug } });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create pipeline");
    },
  });

  const handleLoadSuggestedFlow = () => {
    replace(buildSuggestedStages());
  };

  const onSubmit = async (data: PipelineFormValues) => {
    await createMutation.mutateAsync({
      data: {
        slug,
        name: data.name,
        stages: data.stages.map((stage) => stage.name),
      },
    });
  };

  return (
    <Layout
      variant="header"
      title="Create Pipeline"
      primaryButton={
        <Button
          type="submit"
          form={CREATE_PIPELINE_FORM_ID}
          disabled={createMutation.isPending}
          className="gap-2"
        >
          {createMutation.isPending && (
            <Loader className="size-4 animate-spin" />
          )}
          Create Pipeline
        </Button>
      }
    >
      <form
        id={CREATE_PIPELINE_FORM_ID}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_320px]">
          <div className="rounded-xl border bg-background p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-4">
                <div className="flex size-10 items-center justify-center rounded-md bg-secondary">
                  <GitBranch className="size-5 text-secondary-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">
                      Pipeline setup
                    </h2>
                    <Badge variant="secondary">
                      {formatStageCount(fields.length)}
                    </Badge>
                  </div>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    Create the hiring flow your team will use from intake to
                    decision. Start with the recommended stages, rename anything
                    you need, and reorder the flow before saving.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={createMutation.isPending}
                onClick={handleLoadSuggestedFlow}
              >
                <Check className="size-4" />
                Load Recommended Flow
              </Button>
            </div>

            <Separator className="my-6" />

            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required>Pipeline Name</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Product Hiring"
                      disabled={createMutation.isPending}
                      className="h-11"
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>

          <section className="rounded-xl border bg-background p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Live Preview</p>
                <p className="text-xs text-muted-foreground">
                  How this flow will read to your team.
                </p>
              </div>
              <Badge variant="outline">{formatStageCount(fields.length)}</Badge>
            </div>

            <div className="mt-5 space-y-4">
              <div className="space-y-3">
                {watchedStages.map((stage, index) => (
                  <div key={`${stage.name}-${index}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {stage.name?.trim() || `Stage ${index + 1}`}
                        </p>
                      </div>
                    </div>
                    {index < watchedStages.length - 1 && (
                      <div className="ml-[13px] mt-2 h-4 w-px bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>

        <section className="rounded-xl border bg-background p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Hiring stages</h3>
              <p className="text-sm text-muted-foreground">
                Keep the flow short, action-oriented, and easy for your team to
                scan at a glance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={createMutation.isPending}
                onClick={() => append({ name: "" })}
              >
                <Plus className="size-4" />
                Add Stage
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {fields.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-secondary">
                <GitBranch className="size-5 text-secondary-foreground" />
              </div>
              <h4 className="mt-4 text-sm font-semibold">
                No stages in this flow yet
              </h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Add a stage manually or load the recommended flow to get
                started.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={createMutation.isPending}
                  onClick={() => append({ name: "" })}
                >
                  Add Stage
                </Button>
                <Button
                  type="button"
                  disabled={createMutation.isPending}
                  onClick={handleLoadSuggestedFlow}
                >
                  Load Recommended Flow
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-3 rounded-xl border bg-background px-4 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-secondary-foreground">
                    {index + 1}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">Stage {index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          Candidates arrive here in this order.
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          disabled={index === 0 || createMutation.isPending}
                          onClick={() => move(index, index - 1)}
                        >
                          <ArrowUp className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          disabled={
                            index === fields.length - 1 ||
                            createMutation.isPending
                          }
                          onClick={() => move(index, index + 1)}
                        >
                          <ArrowDown className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          disabled={
                            fields.length === 1 || createMutation.isPending
                          }
                          onClick={() => remove(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </div>

                    <Controller
                      control={form.control}
                      name={`stages.${index}.name`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldContent>
                            <Input
                              {...field}
                              aria-invalid={fieldState.invalid}
                              placeholder={`Stage ${index + 1} name`}
                              disabled={createMutation.isPending}
                              className="h-10"
                            />
                          </FieldContent>
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <FieldError errors={[form.formState.errors.stages as any]} />
        </section>
      </form>
    </Layout>
  );
}
