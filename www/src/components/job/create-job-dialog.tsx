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
import { redirect } from "@tanstack/react-router";

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
    },
    resolver: zodResolver(jobSchema),
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof jobSchema>) =>
      createJobFn({ data: { slug, job: data } }),
    onSuccess: async (data) => {
      await queryClient.refetchQueries(organizationBySlugQueryOptions(slug));
      toast.success("Job created successfully");
      form.reset();
      // throw redirect({
      //   to: "/$slug/jobs/$jobId",
      //   params: { slug, jobId: data.job.id },
      // });
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
