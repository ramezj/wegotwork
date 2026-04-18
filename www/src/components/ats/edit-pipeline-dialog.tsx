import { useState, useEffect } from "react";
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
import { Plus, X, Settings2, Loader, ArrowUp, ArrowDown } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePipelineFn } from "@/features/services/ats/pipeline";
import { toast } from "sonner";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldContent, FieldError } from "../ui/field";

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

interface EditPipelineDialogProps {
  pipeline: {
    id: string;
    name?: string;
    stages: { id: string; name: string; order: number }[];
    jobs?: { title: string }[];
  };
  slug: string;
  trigger?: React.ReactNode;
}

export function EditPipelineDialog({
  pipeline,
  slug,
  trigger,
}: EditPipelineDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<PipelineFormValues>({
    resolver: zodResolver(pipelineSchema),
    defaultValues: {
      name: pipeline.name || "",
      stages: pipeline.stages.map((s) => ({ id: s.id, name: s.name })),
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "stages",
  });

  // Update form when pipeline prop changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: pipeline.name || "",
        stages: pipeline.stages.map((s) => ({ id: s.id, name: s.name })),
      });
    }
  }, [pipeline, open, form]);

  const updateMutation = useMutation({
    mutationFn: updatePipelineFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pipelines", slug],
      });
      toast.success("Pipeline updated successfully");
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update pipeline");
    },
  });

  const onSubmit = (data: PipelineFormValues) => {
    updateMutation.mutate({
      data: {
        id: pipeline.id,
        name: data.name,
        stages: data.stages.map((s, index) => ({
          id: s.id,
          name: s.name,
          order: index,
        })),
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="size-8">
            <Settings2 className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="text-start items-start justify-start">
          <DialogTitle className="flex items-start gap-2">
            <Settings2 className="size-5" />
            Edit Pipeline
          </DialogTitle>
          <DialogDescription className="text-start">
            Modify your hiring pipeline stages and order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <Input
                    aria-invalid={fieldState.invalid}
                    className="w-full h-9"
                    {...field}
                    placeholder="Pipeline name"
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
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6 p-0"
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                    >
                      <ArrowUp className="size-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6 p-0"
                      disabled={index === fields.length - 1}
                      onClick={() => move(index, index + 1)}
                    >
                      <ArrowDown className="size-3" />
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
                              aria-invalid={fieldState.invalid}
                              className="w-full h-9"
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
                    className="text-destructive size-8"
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
              <Plus className="mr-2 h-4 w-4" />
              Add Stage
            </Button>
          </div>

          <DialogFooter>
            <Button
              disabled={updateMutation.isPending}
              className="w-full"
              type="submit"
            >
              {updateMutation.isPending && (
                <Loader className="mr-2 size-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
