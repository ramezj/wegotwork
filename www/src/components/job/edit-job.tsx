import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobWithCategory } from "@/types/job/job";
import { jobSchema } from "@/types/job/job";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { JobCategory } from "generated/prisma/client";
import { useMutation } from "@tanstack/react-query";
import { editJobBySlugFn } from "@/features/services/jobs/edit-by-slug";
import { Loader, MapPin, DollarSign, FileText, Briefcase, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { jobByIdQueryOptions } from "@/features/queries/jobs";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { FormBuilder } from "../forms/FormBuilder";
import { FormFieldType } from "@/types/form-config";

export function EditJobForm({
  job,
  categories,
  pipelines,
  slug,
}: {
  job: JobWithCategory;
  categories: JobCategory[];
  pipelines: any[];
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
      questions: job.questions.map((q) => ({
        id: q.id,
        label: q.label,
        type: q.type as FormFieldType,
        required: q.required,
        placeholder: q.placeholder,
        options: q.options || [],
        order: q.order || 0,
      })),
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
    <form
      id="edit-job-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col"
    >
      {/* Floating save button */}
      <Button
        type="submit"
        disabled={mutation.isPending}
        size="lg"
        className="fixed bottom-5 right-5 z-50 gap-2"
      >
        {mutation.isPending
          ? <Loader className="animate-spin h-4 w-4" />
          : <Check className="h-4 w-4" />}
        Save Changes
      </Button>

      {/* Sections */}
      <div className="flex flex-col gap-6">
        {/* General */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary shrink-0">
              <Briefcase className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">General</CardTitle>
              <CardDescription className="text-xs">
                Basic information about this role
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Job Description</FieldLabel>
                  <FieldContent>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Describe the role, responsibilities, and requirements..."
                      className="min-h-32 resize-y"
                      {...field}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULLTIME">Full Time</SelectItem>
                          <SelectItem value="PARTTIME">Part Time</SelectItem>
                          <SelectItem value="INTERNSHIP">Internship</SelectItem>
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
                    <FieldLabel>Status</FieldLabel>
                    <FieldContent>
                      <Select
                        aria-invalid={fieldState.invalid}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
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
            </div>
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>
                  <FieldContent>
                    <Select
                      aria-invalid={fieldState.invalid}
                      value={field.value || "none"}
                      onValueChange={(value) =>
                        field.onChange(value === "none" ? "" : value)
                      }
                    >
                      <SelectTrigger className="w-full sm:w-64">
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

        {/* Location */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary shrink-0">
              <MapPin className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Location</CardTitle>
              <CardDescription className="text-xs">
                Where is this role based
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Controller
              control={form.control}
              name="locationMode"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Work Mode</FieldLabel>
                  <FieldContent>
                    <Select
                      aria-invalid={fieldState.invalid}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full sm:w-48">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="country"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Country</FieldLabel>
                    <FieldContent>
                      <Input
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. United States"
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
                        placeholder="e.g. San Francisco"
                        {...field}
                      />
                    </FieldContent>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address</FieldLabel>
                  <FieldContent>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Street address (optional)"
                      {...field}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary shrink-0">
              <DollarSign className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Compensation</CardTitle>
              <CardDescription className="text-xs">
                Salary range and experience requirements
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Controller
                control={form.control}
                name="salaryMin"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Min Salary</FieldLabel>
                    <FieldContent>
                      <Input
                        aria-invalid={fieldState.invalid}
                        type="number"
                        placeholder="e.g. 80000"
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
                    <FieldLabel>Max Salary</FieldLabel>
                    <FieldContent>
                      <Input
                        aria-invalid={fieldState.invalid}
                        type="number"
                        placeholder="e.g. 120000"
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
                    <FieldLabel>Interval</FieldLabel>
                    <FieldContent>
                      <Select
                        aria-invalid={fieldState.invalid}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
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
            </div>
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
                      <SelectTrigger className="w-full sm:w-48">
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

        {/* Application Form */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary shrink-0">
              <FileText className="h-4 w-4 text-secondary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Application Form</CardTitle>
              <CardDescription className="text-xs">
                Custom questions candidates will answer
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Controller
              control={form.control}
              name="questions"
              render={({ field }) => (
                <FormBuilder
                  value={(field.value ?? []).map((q) => ({
                    ...q,
                    required: q.required ?? false,
                    options: q.options ?? [],
                    order: q.order ?? 0,
                  }))}
                  onChange={field.onChange}
                />
              )}
            />
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
