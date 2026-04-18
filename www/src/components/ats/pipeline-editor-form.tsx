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
  Loader,
  Plus,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-4">
      <Card>
        <CardContent>
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
                      disabled={updateMutation.isPending}
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
                  {formatStageCount(fields.length)}
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
                        disabled={index === 0 || updateMutation.isPending}
                        onClick={() => move(index, index - 1)}
                      >
                        <ArrowUp className="size-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={
                          index === fields.length - 1 ||
                          updateMutation.isPending
                        }
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
                                disabled={updateMutation.isPending}
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
                      disabled={fields.length === 1 || updateMutation.isPending}
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
                disabled={updateMutation.isPending}
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
                disabled={updateMutation.isPending}
                onClick={() =>
                  navigate({ to: "/$slug/pipelines", params: { slug } })
                }
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader className="size-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 shrink-0">
            <TriangleAlert className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-base">Danger Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Deleting this pipeline will permanently remove it from your
            organization. Jobs must be moved off this pipeline before it can be
            deleted.
          </p>

          <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/20 p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Delete pipeline</p>
              <p className="text-sm text-muted-foreground">
                Remove <strong>{pipeline.name}</strong> from this organization.
              </p>
            </div>

            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending}
              className="gap-2"
              onClick={() => setDeleteDialogOpen(true)}
            >
              {deleteMutation.isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Pipeline
            </Button>
          </div>
        </CardContent>
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
              onClick={() =>
                deleteMutation.mutate({ data: { id: pipeline.id } })
              }
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Pipeline"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
