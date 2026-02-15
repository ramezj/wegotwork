import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobWithCategory } from "@/features/types/job/job";
import { jobSchema } from "@/features/types/job/job";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { JobCategory } from "generated/prisma/client";
import { useMutation } from "@tanstack/react-query";
import { editJobBySlugFn } from "@/features/services/jobs/edit-by-slug";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { jobByIdQueryOptions } from "@/features/queries/jobs";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

export function EditJobForm({
  job,
  categories,
  slug,
}: {
  job: JobWithCategory;
  categories: JobCategory[];
  slug: string;
}) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      ...job,
      title: job.title || "",
      description: job.description || "",
      status: job.status || "DRAFT",
      type: job.type || "FULLTIME",
      locationMode: job.locationMode || "ONSITE",
      country: job.country || "",
      city: job.city || "",
      address: job.address || "",
      salaryMin: job.salaryMin || 0,
      salaryMax: job.salaryMax || 0,
      currency: job.currency || "USD",
      salaryInterval: job.salaryInterval || "MONTHLY",
      experienceLevel: job.experienceLevel || "ENTRY",
      categoryId: job.categoryId || "",
    },
    resolver: zodResolver(jobSchema),
    mode: "onBlur",
  });
  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof jobSchema>) =>
      editJobBySlugFn({ data: { jobId: job.id, job: data } }),
    onSuccess: async () => {
      await queryClient.refetchQueries(jobByIdQueryOptions(job.id));
      await queryClient.refetchQueries(organizationBySlugQueryOptions(slug));
      toast.success("Job updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const onSubmit = (data: z.infer<typeof jobSchema>) => {
    mutation.mutateAsync(data);
  };
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">Edit Job</h1>
        <Button type="submit" form="form" disabled={mutation.isPending}>
          {mutation.isPending && <Loader className="animate-spin" />}
          Save Changes
        </Button>
      </div>

      <form
        id="form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Job Title</FieldLabel>
                      <FieldContent>
                        <Input
                          aria-invalid={fieldState.invalid}
                          placeholder="Job Title"
                          {...field}
                        />
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Job Description</FieldLabel>
                      <FieldContent>
                        <Textarea
                          aria-invalid={fieldState.invalid}
                          placeholder="Job Description"
                          {...field}
                        />
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Employment Type</FieldLabel>
                      <FieldContent>
                        <Select
                          aria-invalid={fieldState.invalid}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FULLTIME">Full Time</SelectItem>
                            <SelectItem value="PARTTIME">Part Time</SelectItem>
                            <SelectItem value="INTERNSHIP">
                              Internship
                            </SelectItem>
                            <SelectItem value="CONTRACT">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                      <FieldError errors={[form.formState.errors.type]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Job Status</FieldLabel>
                      <FieldContent>
                        <Select
                          aria-invalid={fieldState.invalid}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="PUBLISHED">Published</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                            <SelectItem value="ARCHIVED">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Job Category</FieldLabel>
                      <FieldContent>
                        <Select
                          aria-invalid={fieldState.invalid}
                          value={field.value || "none"}
                          onValueChange={(value) =>
                            field.onChange(value === "none" ? "" : value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Category</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Location Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Controller
                  control={form.control}
                  name="country"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Country</FieldLabel>
                      <FieldContent>
                        <Input
                          aria-invalid={fieldState.invalid}
                          placeholder="Country"
                          {...field}
                        />
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="city"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>City</FieldLabel>
                      <FieldContent>
                        <Input
                          aria-invalid={fieldState.invalid}
                          placeholder="City"
                          {...field}
                        />
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="address"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Address</FieldLabel>
                      <FieldContent>
                        <Input
                          aria-invalid={fieldState.invalid}
                          placeholder="Address"
                          {...field}
                        />
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="locationMode"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Location Mode</FieldLabel>
                      <FieldContent>
                        <Select
                          aria-invalid={fieldState.invalid}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="REMOTE">Remote</SelectItem>
                            <SelectItem value="ONSITE">Onsite</SelectItem>
                            <SelectItem value="HYBRID">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compensation" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Compensation Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Controller
                  control={form.control}
                  name="salaryMin"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Salary Min</FieldLabel>
                      <FieldContent>
                        <Input
                          aria-invalid={fieldState.invalid}
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.onChange(isNaN(val) ? undefined : val);
                          }}
                        />
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="salaryMax"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Salary Max</FieldLabel>
                      <FieldContent>
                        <Input
                          aria-invalid={fieldState.invalid}
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const val = e.target.valueAsNumber;
                            field.onChange(isNaN(val) ? undefined : val);
                          }}
                        />
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="salaryInterval"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Salary Interval</FieldLabel>
                      <FieldContent>
                        <Select
                          aria-invalid={fieldState.invalid}
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select interval" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HOURLY">Hourly</SelectItem>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="experienceLevel"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Experience Level</FieldLabel>
                      <FieldContent>
                        <Select
                          aria-invalid={fieldState.invalid}
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ENTRY">Entry</SelectItem>
                            <SelectItem value="MID">Mid</SelectItem>
                            <SelectItem value="SENIOR">Senior</SelectItem>
                            <SelectItem value="LEAD">Lead</SelectItem>
                            <SelectItem value="EXECUTIVE">Executive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                      <FieldError errors={[fieldState.error]} />
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </>
  );
}
