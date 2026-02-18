import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "@/features/types/job/job";
import { createJobFn } from "@/features/services/jobs/create-job";
import z from "zod";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { toast } from "sonner";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Loader, PlusIcon } from "lucide-react";

export function CreateJobDialog({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
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
    onSuccess: async () => {
      await queryClient.refetchQueries(organizationBySlugQueryOptions(slug));
      toast.success("Job created successfully");
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
        <Button variant="default" className="group">
          Create Job
          <PlusIcon className="duration-100 group-hover:rotate-90" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Job</DialogTitle>
          <DialogDescription>
            Create a new job opening for your organization.
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
                    placeholder="Software Engineer"
                    {...field}
                  />
                </FieldContent>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Button
            disabled={mutation.isPending}
            className="w-full"
            type="submit"
          >
            {mutation.isPending && <Loader className="animate-spin" />}
            Create Job
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
