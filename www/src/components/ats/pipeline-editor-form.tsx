import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createPipelineFn,
  updatePipelineFn,
} from "@/features/services/ats/pipeline";

const pipelineSchema = z.object({
  name: z.string().min(1, "Pipeline name is required"),
  stages: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Stage name is required"),
      }),
    )
    .min(1, "At least one stage is required"),
});

type PipelineFormValues = z.infer<typeof pipelineSchema>;

interface PipelineEditorFormProps {
  mode: "create" | "edit";
  slug: string;
  organizationId: string;
  pipeline?: {
    id: string;
    name: string;
    stages: { id: string; name: string; order: number }[];
  };
}

export function PipelineEditorForm({
  mode,
  slug,
  organizationId,
  pipeline,
}: PipelineEditorFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<PipelineFormValues>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      name: pipeline?.name || "",
      stages:
        pipeline?.stages.map((stage) => ({
          id: stage.id,
          name: stage.name,
        })) || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "stages",
  });

  const createMutation = useMutation({
    mutationFn: createPipelineFn,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["pipelines", organizationId],
      });
      toast.success("Pipeline created successfully");
      navigate({ to: "/$slug/pipelines", params: { slug } });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create pipeline");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePipelineFn,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["pipelines", organizationId],
      });
      toast.success("Pipeline updated successfully");
      navigate({ to: "/$slug/pipelines", params: { slug } });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update pipeline");
    },
  });

  const isPending =
    mode === "create" ? createMutation.isPending : updateMutation.isPending;

  const onSubmit = async (data: PipelineFormValues) => {
    if (mode === "create") {
      await createMutation.mutateAsync({
        data: {
          organizationId,
          name: data.name,
          stages: data.stages.map((stage) => stage.name),
        },
      });
      return;
    }

    if (!pipeline) return;

    await updateMutation.mutateAsync({
      data: {
        id: pipeline.id,
        name: data.name,
        stages: data.stages.map((stage, index) => ({
          id: stage.id,
          name: stage.name,
          order: index,
        })),
      },
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="Pipeline name"
                      disabled={isPending}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-medium">Hiring Stages</h2>
                  <p className="text-sm text-muted-foreground">
                    Add, rename, remove, and reorder stages for this pipeline.
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {fields.length} stage{fields.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 rounded-lg border p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={index === 0 || isPending}
                        onClick={() => move(index, index - 1)}
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={index === fields.length - 1 || isPending}
                        onClick={() => move(index, index + 1)}
                      >
                        <ArrowDown className="size-3.5" />
                      </Button>
                    </div>

                    <div className="flex-1">
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
                                disabled={isPending}
                              />
                            </FieldContent>
                            <FieldError errors={[fieldState.error]} />
                          </Field>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      disabled={isPending}
                      onClick={() => remove(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <FieldError errors={[form.formState.errors.stages as any]} />

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={isPending}
                onClick={() => append({ name: "" })}
              >
                <Plus className="size-4" />
                Add Stage
              </Button>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  navigate({ to: "/$slug/pipelines", params: { slug } })
                }
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader className="size-4 animate-spin" />}
                {mode === "create" ? "Create Pipeline" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
