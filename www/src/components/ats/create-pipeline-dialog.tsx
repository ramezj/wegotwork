import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, GripVertical, GitBranch, Loader } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPipelineFn } from "@/features/services/ats/pipeline";
import { toast } from "sonner";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";

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

interface CreatePipelineDialogProps {
  organizationId: string;
}

export function CreatePipelineDialog({
  organizationId,
}: CreatePipelineDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<PipelineFormValues>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      name: "",
      stages: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stages",
  });

  const createMutation = useMutation({
    mutationFn: createPipelineFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pipelines", organizationId],
      });
      toast.success("Pipeline created successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create pipeline");
    },
  });

  const onSubmit = (data: PipelineFormValues) => {
    createMutation.mutate({
      data: {
        name: data.name,
        organizationId,
        stages: data.stages.map((s) => s.name),
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default" className="group">
          Create Pipeline
          <Plus className="duration-100 group-hover:rotate-90" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="text-start items-start justify-start">
          <DialogTitle className="flex items-start gap-2">
            <GitBranch className="size-5" />
            Create a Pipeline
          </DialogTitle>
          <DialogDescription className="text-start">
            Define your new hiring pipeline and connect it to a job opening.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel aria-invalid={fieldState.invalid}>
                  Pipeline Name
                </FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Engineering Pipeline"
                  />
                </FieldContent>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <div className="space-y-2">
            <Label className="flex justify-between items-center">
              Hiring Stages
              <span className="text-xs text-muted-foreground">
                {fields.length} Stages
              </span>
            </Label>
            <div className="space-y-2 overflow-y-auto">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <Controller
                      control={form.control}
                      name={`stages.${index}.name`}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldContent>
                            <Input
                              aria-invalid={fieldState.invalid}
                              className="w-full"
                              {...field}
                              placeholder={`Stage ${index + 1} name`}
                            />
                          </FieldContent>
                          <FieldError errors={[fieldState.error]} />
                        </Field>
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => remove(index)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: "" })}
              className="w-full"
            >
              <Plus className="h-4 w-4" />
              Add Stage
            </Button>
          </div>

          <DialogFooter>
            <Button
              disabled={createMutation.isPending}
              className="w-full"
              type="submit"
            >
              {createMutation.isPending && (
                <Loader className="mr-2 size-4 animate-spin" />
              )}
              Create Pipeline
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
