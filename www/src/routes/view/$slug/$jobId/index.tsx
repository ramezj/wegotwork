import { createFileRoute, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { viewJobQueryOptions } from "@/features/queries/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatJobType } from "@/lib/format-job-type";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Briefcase, Paperclip } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef, useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadResumeFn } from "@/features/services/candidates/upload-resume";
import { createCandidateFn } from "@/features/services/candidates/create-candidate";
import { toast } from "sonner";
import { isRichTextEmpty, sanitizeRichTextHtml } from "@/lib/rich-text";
import { CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormFieldConfig } from "@/types/form-config";
import { absoluteUrl, buildSeo, metaDescription, stripHtml } from "@/lib/seo";

const EMPLOYMENT_TYPE_SCHEMA_MAP: Record<string, string | string[]> = {
  FULLTIME: "FULL_TIME",
  PARTTIME: "PART_TIME",
  FULLTIME_PARTTIME: ["FULL_TIME", "PART_TIME"],
  INTERNSHIP: "INTERN",
  CONTRACT: "CONTRACTOR",
};

const SALARY_INTERVAL_SCHEMA_MAP: Record<string, string> = {
  HOURLY: "HOUR",
  DAILY: "DAY",
  WEEKLY: "WEEK",
  MONTHLY: "MONTH",
  QUARTERLY: "MONTH",
  YEARLY: "YEAR",
};

function formatLocationSummary(job: any) {
  if (job.locationMode === "REMOTE") {
    return job.country ? `Remote (${job.country})` : "Remote";
  }

  const locationParts = [job.office?.name, job.city, job.country].filter(
    Boolean,
  );
  const baseLocation =
    locationParts.length > 0 ? locationParts.join(", ") : "On-site";

  if (job.locationMode === "HYBRID") {
    return `Hybrid in ${baseLocation}`;
  }

  return baseLocation;
}

function formatSalarySummary(job: any) {
  if (!job.showSalary || (!job.salaryMin && !job.salaryMax)) {
    return null;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: job.currency || "USD",
    maximumFractionDigits: 0,
  });

  if (job.salaryMin && job.salaryMax) {
    return `${formatter.format(job.salaryMin)} - ${formatter.format(job.salaryMax)}`;
  }

  if (job.salaryMin) {
    return `From ${formatter.format(job.salaryMin)}`;
  }

  return `Up to ${formatter.format(job.salaryMax)}`;
}

function buildJobDescription(job: any) {
  const location = formatLocationSummary(job);
  const typeLabel = formatJobType(job.type);
  const salary = formatSalarySummary(job);
  const descriptionParts = [
    `${job.title} at ${job.organization.name}.`,
    `${typeLabel} role.`,
    `${location}.`,
    salary ? `${salary}.` : null,
    "Apply online with Lunics.",
  ].filter(Boolean);

  return descriptionParts.join(" ");
}

function buildJobPostingJsonLd(job: any, slug: string) {
  const description = stripHtml(job.description) || buildJobDescription(job);
  const payload: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description,
    datePosted: new Date(job.createdAt).toISOString(),
    directApply: true,
    employmentType: EMPLOYMENT_TYPE_SCHEMA_MAP[job.type] || job.type,
    hiringOrganization: {
      "@type": "Organization",
      name: job.organization.name,
      sameAs: job.organization.website || absoluteUrl(`/view/${slug}`),
      logo: job.organization.logo
        ? `${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${job.organization.logo}`
        : absoluteUrl("/logo512.png"),
    },
    identifier: {
      "@type": "PropertyValue",
      name: job.organization.name,
      value: job.id,
    },
    url: absoluteUrl(`/view/${slug}/${job.id}`),
  };

  if (job.category?.name) {
    payload.industry = job.category.name;
  }

  if (job.locationMode === "REMOTE") {
    payload.jobLocationType = "TELECOMMUTE";
  }

  const addressLocality = job.office?.city || job.city || undefined;
  const addressCountry = job.office?.country || job.country || undefined;

  if (addressLocality || addressCountry) {
    payload.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality,
        addressCountry,
      },
    };
  }

  if (job.showSalary && (job.salaryMin || job.salaryMax)) {
    payload.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.currency || "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin ?? undefined,
        maxValue: job.salaryMax ?? undefined,
        unitText: SALARY_INTERVAL_SCHEMA_MAP[job.salaryInterval] || "MONTH",
      },
    };
  }

  return payload;
}

export const Route = createFileRoute("/view/$slug/$jobId/")({
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      viewJobQueryOptions(params.jobId),
    );
    if (!data.success) {
      throw redirect({
        to: "/view/$slug",
        params: { slug: params.slug },
      });
    }
    return { data };
  },
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(viewJobQueryOptions(params.jobId)),
  head: ({ loaderData, params }) => {
    if (!loaderData?.success || !loaderData.job) {
      return buildSeo({
        title: "Job not found",
        description: "This job is no longer available.",
        path: `/view/${params.slug}/${params.jobId}`,
        noIndex: true,
      });
    }

    const description =
      metaDescription(stripHtml(loaderData.job.description), 150) ||
      buildJobDescription(loaderData.job);

    return buildSeo({
      title: `${loaderData.job.title} at ${loaderData.job.organization.name}`,
      description,
      path: `/view/${params.slug}/${params.jobId}`,
      jsonLd: buildJobPostingJsonLd(loaderData.job, params.slug),
    });
  },
});

// ---------------------------------------------------------------------------
// Build a client-side zod schema that mirrors dynamic-schema.ts on the server
// ---------------------------------------------------------------------------
function buildSchema(questions: FormFieldConfig[]) {
  const responsesShape: Record<string, z.ZodTypeAny> = {};

  questions.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "SHORT_ANSWER":
      case "LONG_ANSWER":
      case "SELECT":
        fieldSchema = field.required
          ? z.string().min(1, `${field.label} is required`)
          : z.string().optional().nullable();
        break;

      case "MULTI_SELECT":
        fieldSchema = field.required
          ? z
              .array(z.string())
              .min(1, `Please select at least one ${field.label}`)
          : z.array(z.string()).optional().default([]);
        break;

      case "CHECKBOX":
        fieldSchema = field.required
          ? z.literal(true, { message: `${field.label} must be checked` })
          : z.boolean().optional().default(false);
        break;

      default:
        fieldSchema = z.string().optional().nullable();
    }

    responsesShape[field.id] = fieldSchema;
  });
  return z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    resume: z
      .instanceof(File, { message: "Resume is required" })
      .refine((f) => f.size > 0, "Resume is required"),
    responses: z.object(responsesShape),
  });
}

type ApplicationFormValues = {
  name: string;
  email: string;
  resume: File;
  responses: Record<string, any>;
};

// ---------------------------------------------------------------------------
// Route component
// ---------------------------------------------------------------------------
function RouteComponent() {
  const { slug, jobId } = Route.useParams();
  const { data } = useSuspenseQuery(viewJobQueryOptions(jobId));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const questions: FormFieldConfig[] = useMemo(
    () => (data?.job?.questions as FormFieldConfig[]) ?? [],
    [data?.job?.questions],
  );

  const schema = useMemo(() => buildSchema(questions), [questions]);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      email: "",
      resume: undefined as any,
      responses: {},
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const resumeFile = watch("resume");

  const { mutate: submitApplication, isPending } = useMutation({
    mutationFn: async (values: ApplicationFormValues) => {
      // 1. Upload resume
      const uploadFormData = new FormData();
      uploadFormData.append("resume", values.resume);
      const uploadResult = await uploadResumeFn({ data: uploadFormData });
      const resumeKey = uploadResult.key;

      // 2. Create candidate
      return createCandidateFn({
        data: {
          name: values.name,
          email: values.email,
          resumeKey,
          jobId,
          responses: values.responses,
        },
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        setIsSubmitted(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(result.error || "Submission failed. Please try again.");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  // -------------------------------------------------------------------------
  // Guard: job not found
  // -------------------------------------------------------------------------
  if (!data?.success || !data?.job) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Job not found or no longer available.
        </p>
        <Button asChild variant="outline">
          <Link to="/view/$slug" params={{ slug }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Open Roles
          </Link>
        </Button>
      </div>
    );
  }

  const { job } = data;
  if (isSubmitted) {
    return (
      <div className="mx-auto w-full px-4 py-8 sm:py-10">
        <section className="border p-2">
          <div className="flex min-h-[420px] flex-col items-center justify-center bg-white px-6 py-12 text-center sm:px-10">
            <div className="space-y-5">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="size-10" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-normal uppercase  text-muted-foreground">
                  Application Submitted
                </p>
                <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">
                  Your application is in.
                </h1>
                <p className="mx-auto max-w-xl text-sm font-medium leading-6 text-muted-foreground sm:text-base">
                  Thank you for applying to {job.organization.name}. We&apos;ve
                  received your application for the {job.title} role and the
                  team will review it shortly.
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/view/$slug" params={{ slug }}>
                  Back to Open Roles
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }
  const typeLabel = formatJobType(job.type);
  const locationLabel =
    job.locationMode.charAt(0) + job.locationMode.slice(1).toLowerCase();
  return (
    <div className="mx-auto w-full">
      <div className="space-y-4">
        <section className="border">
          <div className="bg-secondary p-8">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="space-y-3">
                    <h1 className="max-w-4xl text-4xl font-normal tracking-tight text-balance sm:text-4xl">
                      {job.title}
                    </h1>
                    <p className="max-w-2xl text-sm font-normal leading-6 text-muted-foreground sm:text-base">
                      Apply to join {job.organization.name} and help build the
                      next chapter of the team.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.category && (
                    <Badge variant="default">{job.category.name}</Badge>
                  )}
                  <Badge variant="default">
                    <Briefcase />
                    {typeLabel}
                  </Badge>
                  <Badge variant="default">
                    <MapPin />
                    {locationLabel}
                  </Badge>
                  {job.office && (
                    <Badge variant="default">{job.office.name}</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="space-y-4">
          {job.description && (
            <section className="border">
              <div className="bg-secondary px-6 py-8 sm:px-8 sm:py-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-normal tracking-tight">
                      Job Description
                    </h2>
                  </div>
                  <Separator />
                  <div
                    className="wysiwyg-content text-sm text-black sm:text-base"
                    dangerouslySetInnerHTML={{
                      __html: isRichTextEmpty(job.description)
                        ? "<p>No description provided.</p>"
                        : sanitizeRichTextHtml(job.description),
                    }}
                  />
                </div>
              </div>
            </section>
          )}
          <div>
            <section className="border">
              <div className="bg-secondary px-6 py-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-normal uppercase  text-muted-foreground">
                      Apply
                    </p>
                    <h2 className="text-2xl font-normal tracking-tight">
                      Apply for this role
                    </h2>
                    <p className="text-sm font-medium leading-6 text-muted-foreground">
                      Share your details and we&apos;ll send your application
                      directly to the hiring team.
                    </p>
                  </div>
                  <Separator />
                  <form
                    className="flex flex-col space-y-5"
                    onSubmit={handleSubmit((values) =>
                      submitApplication(values),
                    )}
                  >
                    <div className="grid gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="name">
                          Full name <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              id="name"
                              placeholder="Jane Doe"
                              aria-invalid={fieldState.invalid}
                              {...field}
                            />
                          )}
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Input
                              id="email"
                              type="email"
                              placeholder="jane@example.com"
                              aria-invalid={fieldState.invalid}
                              {...field}
                            />
                          )}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label>
                        Resume / CV <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="resume"
                        control={control}
                        render={({ fieldState }) => (
                          <label
                            htmlFor="resume"
                            className="flex items-center gap-2 w-fit cursor-pointer border border-input rounded-sm px-4 py-2 text-sm hover:bg-muted transition-colors"
                          >
                            <Paperclip className="size-4 shrink-0" />
                            {resumeFile?.name ?? "Attach file"}
                            <input
                              ref={fileInputRef}
                              aria-invalid={fieldState.invalid}
                              id="resume"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              className="sr-only"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file)
                                  setValue("resume", file, {
                                    shouldValidate: true,
                                  });
                              }}
                            />
                          </label>
                        )}
                      />
                      {errors.resume && (
                        <p className="text-sm text-destructive">
                          {errors.resume.message as string}
                        </p>
                      )}
                    </div>

                    {questions.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-5">
                          {questions.map((field) => (
                            <div
                              key={field.id}
                              className="flex flex-col gap-1.5"
                            >
                              <Label htmlFor={field.id}>
                                {field.label}{" "}
                                {field.required && (
                                  <span className="text-destructive">*</span>
                                )}
                              </Label>

                              {field.type === "SHORT_ANSWER" && (
                                <Controller
                                  name={`responses.${field.id}` as any}
                                  control={control}
                                  defaultValue=""
                                  render={({ field: f, fieldState }) => (
                                    <Input
                                      id={field.id}
                                      aria-invalid={fieldState.invalid}
                                      placeholder={
                                        field.placeholder || undefined
                                      }
                                      {...f}
                                    />
                                  )}
                                />
                              )}

                              {field.type === "LONG_ANSWER" && (
                                <Controller
                                  name={`responses.${field.id}` as any}
                                  control={control}
                                  defaultValue=""
                                  render={({ field: f, fieldState }) => (
                                    <Textarea
                                      id={field.id}
                                      aria-invalid={fieldState.invalid}
                                      placeholder={
                                        field.placeholder || undefined
                                      }
                                      className="min-h-32"
                                      {...f}
                                    />
                                  )}
                                />
                              )}

                              {field.type === "SELECT" && (
                                <Controller
                                  name={`responses.${field.id}` as any}
                                  control={control}
                                  defaultValue=""
                                  render={({ field: f, fieldState }) => (
                                    <Select
                                      value={f.value ?? ""}
                                      onValueChange={f.onChange}
                                    >
                                      <SelectTrigger
                                        aria-invalid={fieldState.invalid}
                                        id={field.id}
                                      >
                                        <SelectValue
                                          placeholder={
                                            field.placeholder ||
                                            "Select an option"
                                          }
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {(field.options || []).map((option) => (
                                          <SelectItem
                                            key={option}
                                            value={option}
                                          >
                                            {option}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              )}

                              {field.type === "CHECKBOX" && (
                                <Controller
                                  name={`responses.${field.id}` as any}
                                  control={control}
                                  defaultValue={false}
                                  render={({ field: f, fieldState }) => (
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id={field.id}
                                        checked={!!f.value}
                                        onCheckedChange={f.onChange}
                                        aria-invalid={fieldState.invalid}
                                      />
                                      <Label
                                        htmlFor={field.id}
                                        className="text-sm font-normal text-muted-foreground"
                                      >
                                        {field.placeholder || "I agree"}
                                      </Label>
                                    </div>
                                  )}
                                />
                              )}

                              {(errors as any)?.responses?.[field.id] && (
                                <p className="text-sm text-destructive">
                                  {(errors as any).responses[field.id]?.message}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isPending}
                    >
                      {isPending ? "Submitting..." : "Submit application"}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                      By submitting you agree to our privacy policy and terms of
                      service.
                    </p>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
