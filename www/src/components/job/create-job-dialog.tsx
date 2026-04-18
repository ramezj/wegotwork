import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "@/types/job/job";
import { createJobFn } from "@/features/services/jobs/create-job";
import z from "zod";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { pipelinesQueryOptions } from "@/features/queries/ats";
import { toast } from "sonner";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Loader, PlusIcon, Briefcase, BriefcaseBusiness } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function CreateJobDialog({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const { data: pipelinesData } = useSuspenseQuery(pipelinesQueryOptions(slug));
  const pipelines = pipelinesData?.pipelines || [];

  const defaultPipelineId =
    orgData?.organization?.defaultPipelineId ||
    (pipelines.length > 0 ? pipelines[0].id : "") ||
    "";

  const form = useForm({
    defaultValues: {
      title: "",
      status: "DRAFT",
      type: "FULLTIME",
      locationMode: "ONSITE",
      country: "",
      city: "",
      address: "",
      salaryMin: 0,
      salaryMax: 0,
      currency: "USD",
      salaryInterval: "MONTHLY",
      experienceLevel: "ENTRY",
      categoryId: "",
      officeId: "",
      pipelineId: defaultPipelineId,
    },
    resolver: zodResolver(jobSchema),
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof jobSchema>) => {
      return createJobFn({ data: { slug, job: data } });
    },
    onSuccess: async (data) => {
      if (data.status === 200) {
        await queryClient.invalidateQueries({ queryKey: ["jobs", slug] });
        toast.success(data.statusText);
        form.reset({
          title: "",
          status: "DRAFT",
          type: "FULLTIME",
          locationMode: "ONSITE",
          country: "",
          city: "",
          address: "",
          salaryMin: 0,
          salaryMax: 0,
          currency: "USD",
          salaryInterval: "MONTHLY",
          experienceLevel: "ENTRY",
          categoryId: "",
          officeId: "",
          pipelineId: defaultPipelineId,
        });
        setOpen(false);
      } else {
        toast.error(data.statusText);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof jobSchema>) => {
    mutation.mutateAsync(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="group transition-all ">
          Create Job
          <PlusIcon className="duration-300 group-hover:rotate-90" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="items-start text-left">
          <DialogTitle className="flex items-center gap-2">
            <BriefcaseBusiness className="size-5" />
            Create a Job
          </DialogTitle>
          <DialogDescription>Define your new job opening</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel required>Job Title</FieldLabel>
                <FieldContent>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Senior Software Engineer"
                    {...field}
                  />
                </FieldContent>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="officeId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Office</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.value || "none"}
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an office" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Office</SelectItem>
                      {[]}
                    </SelectContent>
                  </Select>
                </FieldContent>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="pipelineId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel required>Pipeline</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={pipelines.length === 0}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a pipeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelines.map((pipeline: any) => (
                        <SelectItem key={pipeline.id} value={pipeline.id}>
                          {pipeline.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <div>
            <Button
              disabled={mutation.isPending || pipelines.length === 0}
              type="submit"
              className="w-full"
            >
              {mutation.isPending ? (
                <Loader className="mr-2 size-5 animate-spin" />
              ) : (
                "Create Job Posting"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
