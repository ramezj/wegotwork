import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Save,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  deletePipelineFn,
  updatePipelineFn,
} from "@/features/services/ats/pipeline";
import { Layout } from "../shared/layout";

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

function formatStageCount(count: number) {
  return `${count} stage${count === 1 ? "" : "s"}`;
}

interface PipelineEditorFormProps {
  slug: string;
  pipeline: {
    id: string;
    name: string;
    stages: { id: string; name: string; order: number }[];
  };
}

export function PipelineEditorForm({
  slug,
  pipeline,
}: PipelineEditorFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm<PipelineFormValues>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      name: pipeline.name || "",
      stages: pipeline.stages.map((stage) => ({
        id: stage.id,
        name: stage.name,
      })),
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "stages",
  });

  const updateMutation = useMutation({
    mutationFn: updatePipelineFn,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["pipelines", slug],
      });
      toast.success("Pipeline updated successfully");
      navigate({ to: "/$slug/pipelines", params: { slug } });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update pipeline");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePipelineFn,
    onSuccess: async () => {
      setDeleteDialogOpen(false);
      await queryClient.refetchQueries({
        queryKey: ["pipelines", slug],
      });
      toast.success("Pipeline deleted successfully");
      navigate({ to: "/$slug/pipelines", params: { slug } });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete pipeline");
    },
  });

  const onSubmit = async (data: PipelineFormValues) => {
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
    <Layout
      variant="header"
      title="Edit Pipeline"
      primaryButton={
        <Button
          form="pipeline-form"
          type="submit"
          disabled={updateMutation.isPending}
          className="gap-2"
        >
          Save Changes
          {updateMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
        </Button>
      }
    >
      <form
        id="pipeline-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Pipeline Details */}
        <Card className="p-4">
          <div className="space-y-4">
            {/* <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-base">Pipeline Details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Update the pipeline name and configuration
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
                      disabled={updateMutation.isPending}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        </Card>

        {/* Stages List */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
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
                disabled={updateMutation.isPending}
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
                    Add stages to define your hiring flow
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
                              disabled={updateMutation.isPending}
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
                          disabled={index === 0 || updateMutation.isPending}
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
                            updateMutation.isPending
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
                            fields.length === 1 || updateMutation.isPending
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
      </form>

      <Card className="border-destructive mt-4 p-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 shrink-0">
              <TriangleAlert className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-base">Danger Zone</CardTitle>
              <p className="text-sm text-muted-foreground">
                Permanently delete this pipeline
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/20 p-4 bg-destructive/5">
          <div className="space-y-1">
            <p className="text-sm font-medium">Delete pipeline</p>
            <p className="text-sm text-muted-foreground">
              Remove <strong>{pipeline.name}</strong> from this organization.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            className="gap-2"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Pipeline
            <Trash2 className="size-4" />
          </Button>
        </div>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader className="items-start text-left">
            <DialogTitle>Delete this pipeline?</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{pipeline.name}</strong>.
              Jobs must be reassigned before this pipeline can be deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={deleteMutation.isPending}
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              className="gap-2"
              onClick={() =>
                deleteMutation.mutate({ data: { id: pipeline.id } })
              }
            >
              Delete Pipeline
              {deleteMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
