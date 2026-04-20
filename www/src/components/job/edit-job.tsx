import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobWithCategory } from "@/types/job/job";
import { jobSchema } from "@/types/job/job";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
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
import type { JobCategory, Office } from "generated/prisma/client";
import { useMutation } from "@tanstack/react-query";
import { editJobBySlugFn } from "@/features/services/jobs/edit-by-slug";
import { deleteJobFn } from "@/features/services/jobs/delete-job";
import {
  Loader,
  MapPin,
  DollarSign,
  FileText,
  Briefcase,
  TriangleAlert,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { jobByIdQueryOptions } from "@/features/queries/jobs";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { FormBuilder } from "../forms/FormBuilder";
import { FormFieldType } from "@/types/form-config";
import { Layout } from "../shared/layout";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RichTextEditor } from "../ui/rich-text-editor";

export function EditJobForm({
  job,
  categories,
  offices,
  pipelines,
  slug,
}: {
  job: JobWithCategory;
  categories: JobCategory[];
  offices: Office[];
  pipelines: { id: string; name: string }[];
  slug: string;
}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      ...job,
      title: job.title || "",
      description: job.description || "",
      status: job.status || "DRAFT",
      type: job.type || "FULLTIME",
      showSalary: job.showSalary ?? false,
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
      officeId: job.officeId || "",
      pipelineId: job.pipelineId || "",
      questions: (job.questions ?? []).map((q) => ({
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
      await Promise.all([
        queryClient.refetchQueries(jobByIdQueryOptions(job.id)),
        queryClient.invalidateQueries({ queryKey: ["jobs", slug] }),
        queryClient.invalidateQueries({
          queryKey: organizationBySlugQueryOptions(slug).queryKey,
        }),
      ]);
      toast.success("Job updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteJobFn({ data: { jobId: job.id } }),
    onSuccess: async (result) => {
      // setDeleteDialogOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["jobs", slug],
      });
      await queryClient.invalidateQueries({
        queryKey: ["organization", slug],
      });

      toast.success(
        result.deletedCandidates > 0
          ? `Job deleted successfully. ${result.deletedCandidates} candidate${result.deletedCandidates === 1 ? "" : "s"} were removed with it.`
          : "Job deleted successfully",
      );
      navigate({ to: "/$slug/jobs", params: { slug } });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete job");
    },
  });

  const onSubmit = (data: z.infer<typeof jobSchema>) => {
    mutation.mutateAsync(data);
  };

  return (
    <Layout
      variant="header"
      title={form.watch("title") || "Edit Job"}
      primaryButton={
        <Button
          type="submit"
          form="edit-job-form"
          disabled={mutation.isPending}
          className="gap-2"
        >
          {mutation.isPending ? (
            <Loader className="animate-spin h-4 w-4" />
          ) : (
            <Save />
          )}
          Save Changes
        </Button>
      }
    >
      <form
        id="edit-job-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-primary shrink-0">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Job Status</CardTitle>
              <CardDescription className="text-xs">
                Set the status of the job
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="status"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Status</FieldLabel>
                    <FieldContent>
                      <Select
                        aria-invalid={fieldState.invalid}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-background">
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
          </CardContent>
        </Card>

        {/* General */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-primary shrink-0">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
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
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Job Description</FieldLabel>
                  <FieldContent>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Describe the role, responsibilities, requirements, and any important context..."
                      disabled={mutation.isPending}
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
                    <FieldLabel required>Employment Type</FieldLabel>
                    <FieldContent>
                      <Select
                        aria-invalid={fieldState.invalid}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULLTIME">Full Time</SelectItem>
                          <SelectItem value="PARTTIME">Part Time</SelectItem>
                          <SelectItem value="FULLTIME_PARTTIME">
                            Full Time or Part Time
                          </SelectItem>
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
                        <SelectTrigger className="w-full bg-background">
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
              <Controller
                control={form.control}
                name="officeId"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Office</FieldLabel>
                    <FieldContent>
                      <Select
                        aria-invalid={fieldState.invalid}
                        value={field.value || "none"}
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? "" : value)
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select an office" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Office</SelectItem>
                          {offices.map((office) => (
                            <SelectItem key={office.id} value={office.id}>
                              {office.name}
                            </SelectItem>
                          ))}
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
                        aria-invalid={fieldState.invalid}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select a pipeline" />
                        </SelectTrigger>
                        <SelectContent>
                          {pipelines.map((pipeline) => (
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="experienceLevel"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Experience Level</FieldLabel>
                    <FieldContent>
                      <Select
                        aria-invalid={fieldState.invalid}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-background">
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
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-primary shrink-0">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Location</CardTitle>
              <CardDescription className="text-xs">
                Where is this role based
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="locationMode"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel required>Work Mode</FieldLabel>
                    <FieldContent>
                      <Select
                        aria-invalid={fieldState.invalid}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-background">
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
            </div>
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
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-primary shrink-0">
              <DollarSign className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Compensation</CardTitle>
              <CardDescription className="text-xs">
                Salary range and experience requirements
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="showSalary"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Show Salary</FieldLabel>
                    <FieldContent>
                      <Select
                        aria-invalid={fieldState.invalid}
                        value={String(field.value)}
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                      >
                        <SelectTrigger className="w-full bg-background">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <FieldLabel required>Interval</FieldLabel>
                    <FieldContent>
                      <Select
                        aria-invalid={fieldState.invalid}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full bg-background">
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
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-primary shrink-0">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">Application Form</CardTitle>
              <CardDescription className="text-xs">
                Custom questions candidates will answer
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
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

        <Card className="border-destructive">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 shrink-0">
              <TriangleAlert className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-base">Danger Zone</CardTitle>
              {/* <CardDescription className="text-xs">
                Delete this job permanently
              </CardDescription> */}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Deleting this job will permanently remove the posting, its
              application questions, and any candidates attached to it.
            </p>
            <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/20 p-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Delete job</p>
                <p className="text-sm text-muted-foreground">
                  This cannot be undone.
                  {job._count?.candidates
                    ? ` ${job._count.candidates} candidate${job._count.candidates === 1 ? "" : "s"} will also be deleted.`
                    : ""}
                </p>
              </div>
              <Dialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    // disabled={deleteMutation.isPending}
                    className="gap-2"
                  >
                    Delete Job
                    <Trash2 />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader className="items-start text-left">
                    <DialogTitle>Delete this job?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete <strong>{job.title}</strong>,
                      its application form, and any candidates attached to it.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(false)}
                      disabled={deleteMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate()}
                      disabled={deleteMutation.isPending}
                    >
                      Delete Job
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </form>
    </Layout>
  );
}
