import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { JobCategory } from "generated/prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "@/types/job";
import { createJobFn } from "@/server/jobs/create-job";
import z from "zod";
import { organizationBySlugQueryOptions } from "@/queries/organization";
import { toast } from "sonner";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Loader } from "lucide-react";

export function CreateJobDialog({
  categories,
  slug,
}: {
  categories: JobCategory[];
  slug: string;
}) {
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
        <Button variant="outline">Create Job</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Title</FieldLabel>
                <FieldContent>
                  <Input {...field} />
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
