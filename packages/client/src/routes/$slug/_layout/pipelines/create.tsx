import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Layout } from "@/components/shared/layout";
import { createPipelineFn } from "@/features/services/ats/pipeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { buildSeo } from "@/lib/seo";
const CREATE_PIPELINE_FORM_ID = "create-pipeline-form";

const PIPELINE_TEMPLATES = [
  {
    name: "Standard",
    description: "For most roles",
    stages: ["Applied", "Screen", "Interview", "Offer"],
  },
  {
    name: "Technical",
    description: "With assessment",
    stages: ["Applied", "Screen", "Take-home", "Interview", "Offer"],
  },
  {
    name: "Senior",
    description: "Multi-interview",
    stages: ["Applied", "Screen", "Interview", "Final Interview", "Offer"],
  },
  {
    name: "Agency",
    description: "Client approval",
    stages: ["Received", "Review", "Shortlist", "Client Submit", "Placement"],
  },
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

function formatStageCount(count: number) {
  return `${count} stage${count === 1 ? "" : "s"}`;
}

export const Route = createFileRoute("/$slug/_layout/pipelines/create")({
  component: CreatePipelinePage,
  head: () => {
    return buildSeo({
      title: "Create Pipeline",
      description: "Create a new hiring pipeline",
      path: "",
      noIndex: true,
    });
  },
});

function CreatePipelinePage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<PipelineFormValues>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      name: "",
      stages: PIPELINE_TEMPLATES[0].stages.map((name) => ({ name })),
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

  const handleLoadTemplate = (stages: string[]) => {
    replace(stages.map((name) => ({ name })));
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
          Create Pipeline
          {createMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      }
    >
      <form
        id={CREATE_PIPELINE_FORM_ID}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Pipeline Name & Templates */}
        <Card className="p-4">
          <div className="space-y-4">
            {/* <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">Pipeline Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Name your pipeline and choose a starting template
                </p>
              </div>
              <Badge variant="secondary">
                {formatStageCount(fields.length)}
              </Badge>
            </div> */}

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
                      placeholder="e.g. Engineering Hiring, Sales Team, etc."
                      disabled={createMutation.isPending}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Template Selector */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Start with a template
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PIPELINE_TEMPLATES.map((template) => (
                  <button
                    key={template.name}
                    type="button"
                    onClick={() => handleLoadTemplate(template.stages)}
                    disabled={createMutation.isPending}
                    className="rounded-lg border bg-background p-4 text-left transition-colors hover:bg-secondary hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm">
                        {template.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {template.stages.length}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {template.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {template.stages.slice(0, 3).map((stage) => (
                        <span
                          key={stage}
                          className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground"
                        >
                          {stage}
                        </span>
                      ))}
                      {template.stages.length > 3 && (
                        <span className="inline-flex items-center rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
                          +{template.stages.length - 3}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Stages List */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-base">Stages</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Define each step candidates move through
                </p>
              </div>
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

            <div>
              {fields.length === 0 ? (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">No stages yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add stages manually or select a template above
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="group flex items-center gap-3 rounded-lg border bg-background p-3"
                    >
                      {/* Stage Number */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-medium text-primary-foreground">
                        {index + 1}
                      </div>

                      {/* Stage Input */}
                      <Controller
                        control={form.control}
                        name={`stages.${index}.name`}
                        render={({ field: stageField, fieldState }) => (
                          <div className="flex-1 min-w-0">
                            <Input
                              {...stageField}
                              placeholder={`Stage ${index + 1} name`}
                              disabled={createMutation.isPending}
                              className="h-9"
                            />
                            {fieldState.error && (
                              <p className="text-xs text-destructive mt-1">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          disabled={index === 0 || createMutation.isPending}
                          onClick={() => move(index, index - 1)}
                        >
                          <ArrowUp className="size-4" />
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
                          <ArrowDown className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={
                            fields.length === 1 || createMutation.isPending
                          }
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <FieldError errors={[form.formState.errors.stages as any]} />
            </div>
          </div>
        </Card>

        {/* Preview */}
        {/* <Card className="bg-secondary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Pipeline Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2">
              {watchedStages.map((stage, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="rounded-md bg-background border px-3 py-1.5 text-sm">
                    {stage.name?.trim() || `Stage ${index + 1}`}
                  </div>
                  {index < watchedStages.length - 1 && (
                    <span className="text-muted-foreground">→</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </form>
    </Layout>
  );
}
