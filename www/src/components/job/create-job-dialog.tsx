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
import { toast } from "sonner";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Loader, PlusIcon, GitBranch, Briefcase } from "lucide-react";
import { pipelinesQueryOptions } from "@/features/queries/ats";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function CreateJobDialog({ slug }: { slug: string }) {
  const queryClient = useQueryClient();

  // Get organization data to get organizationId
  const { data: orgData } = useSuspenseQuery(
    organizationBySlugQueryOptions(slug),
  );
  const organizationId = orgData?.organization?.id;

  // Get pipelines for the organization
  const { data: pipelinesData } = useSuspenseQuery(
    pipelinesQueryOptions(organizationId || ""),
  );
  const pipelines = pipelinesData || [];

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
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
      pipelineId: "",
    },
    resolver: zodResolver(jobSchema),
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof jobSchema>) =>
      createJobFn({ data: { slug, job: data } }),
    onSuccess: async () => {
      await queryClient.refetchQueries(organizationBySlugQueryOptions(slug));
      toast.success("Job created successfully");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof jobSchema>) => {
    mutation.mutateAsync(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="group transition-all">
          Create Job
          <PlusIcon className="duration-300 group-hover:rotate-90" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="size-5" />
            Create a Job
          </DialogTitle>
          <DialogDescription>
            Define your new job opening and connect it to a hiring pipeline.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Job Title</FieldLabel>
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
            name="pipelineId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="flex items-center gap-2">
                  <GitBranch className="size-3.5 text-primary" /> Hiring
                  Pipeline
                </FieldLabel>
                <FieldContent>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a hiring pipeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelines.map((pipeline: any) => (
                        <SelectItem key={pipeline.id} value={pipeline.id}>
                          {pipeline.name}
                        </SelectItem>
                      ))}
                      {pipelines.length === 0 && (
                        <div className="p-4 text-center text-xs text-muted-foreground italic font-medium">
                          No pipelines found. Please create one in settings.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </FieldContent>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <div>
            <Button
              disabled={mutation.isPending}
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
