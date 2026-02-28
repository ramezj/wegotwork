import { createFileRoute, redirect } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { viewJobQueryOptions } from "@/features/queries/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Briefcase, Paperclip } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useRef, useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadResumeFn } from "@/features/services/applicants/upload-resume";
import { createApplicantFn } from "@/features/services/applicants/create-applicant";
import { toast } from "sonner";
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
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.job?.title || "Hirelou",
      },
    ],
  }),
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
  const { data } = useSuspenseQuery(viewJobQueryOptions(jobId)) as any;
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

      // 2. Create applicant
      return createApplicantFn({
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

  // -------------------------------------------------------------------------
  // Success screen
  // -------------------------------------------------------------------------
  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <div className="size-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <CheckCircle2 className="size-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Application Sent!
          </h1>
          <p className="text-muted-foreground max-w-md">
            Thank you for applying to {job.organization.name}. We've received
            your application for the {job.title} position and will be in touch
            soon.
          </p>
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/view/$slug" params={{ slug }}>
            Back to Open Roles
          </Link>
        </Button>
      </div>
    );
  }

  const typeLabel = job.type
    .split("_")
    .map((w: string) => w.charAt(0) + w.slice(1).toLowerCase())
    .join("-");

  const locationLabel =
    job.locationMode.charAt(0) + job.locationMode.slice(1).toLowerCase();

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="w-full mx-auto flex flex-col space-y-4 border rounded-lg p-4">
      {/* Job header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight leading-snug">
          {job.title}
        </h1>

        <div className="flex flex-wrap gap-2">
          {job.category && (
            <Badge variant="secondary">{job.category.name}</Badge>
          )}
          <Badge variant="secondary">
            <Briefcase className="size-3" />
            {typeLabel}
          </Badge>
          <Badge variant="secondary">
            <MapPin className="size-3" />
            {locationLabel}
          </Badge>
        </div>
      </div>

      <Separator />
      <div className="text-sm leading-7 text-foreground/80 whitespace-pre-wrap">
        {job.description || "No description provided."}
      </div>
      <Separator />

      {/* Application form */}
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold">Apply</h2>

        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit((values) => submitApplication(values))}
        >
          {/* ----------------------------------------------------------------
              Core fields: Name + Email
          ---------------------------------------------------------------- */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Full name */}
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

            {/* Email */}
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

          {/* ----------------------------------------------------------------
              Resume / CV
          ---------------------------------------------------------------- */}
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
                        setValue("resume", file, { shouldValidate: true });
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

          {/* ----------------------------------------------------------------
              Dynamic job-specific questions
          ---------------------------------------------------------------- */}
          {questions.length > 0 && (
            <>
              <Separator className="my-2" />
              {questions.map((field) => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <Label htmlFor={field.id}>
                    {field.label}{" "}
                    {field.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </Label>

                  {/* SHORT_ANSWER */}
                  {field.type === "SHORT_ANSWER" && (
                    <Controller
                      name={`responses.${field.id}` as any}
                      control={control}
                      defaultValue=""
                      render={({ field: f, fieldState }) => (
                        <Input
                          id={field.id}
                          aria-invalid={fieldState.invalid}
                          placeholder={field.placeholder || undefined}
                          {...f}
                        />
                      )}
                    />
                  )}

                  {/* LONG_ANSWER */}
                  {field.type === "LONG_ANSWER" && (
                    <Controller
                      name={`responses.${field.id}` as any}
                      control={control}
                      defaultValue=""
                      render={({ field: f, fieldState }) => (
                        <Textarea
                          id={field.id}
                          aria-invalid={fieldState.invalid}
                          placeholder={field.placeholder || undefined}
                          className="min-h-32"
                          {...f}
                        />
                      )}
                    />
                  )}

                  {/* SELECT */}
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
                                field.placeholder || "Select an option"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {(field.options || []).map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}

                  {/* CHECKBOX */}
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

                  {/* Inline error */}
                  {(errors as any)?.responses?.[field.id] && (
                    <p className="text-sm text-destructive">
                      {(errors as any).responses[field.id]?.message}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full mt-4"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit application"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting you agree to our privacy policy and terms of service.
          </p>
        </form>
      </div>
    </div>
  );
}
