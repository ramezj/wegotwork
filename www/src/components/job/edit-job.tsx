import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "generated/prisma/client";
import { jobSchema } from "@/types/job";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "../ui/field";
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

export function EditJobForm({ job }: { job: Job }) {
  const form = useForm({
    defaultValues: {
      ...job,
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
  });
  return (
    <>
      <form>
        <Form {...form}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Job Details</FieldLegend>
              <FieldDescription>Edit job information</FieldDescription>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Title</FieldLabel>
                      <FieldContent>
                        <Input {...field} />
                      </FieldContent>
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Description</FieldLabel>
                      <FieldContent>
                        <Textarea {...field} />
                      </FieldContent>
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Type</FieldLabel>
                      <FieldContent>
                        <Select defaultValue={field.value}>
                          <SelectTrigger className="w-36">
                            <SelectValue defaultValue={field.value} />
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
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="locationMode"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Location Mode</FieldLabel>
                      <FieldContent>
                        <Select defaultValue={field.value}>
                          <SelectTrigger className="w-36">
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="REMOTE">Remote</SelectItem>
                            <SelectItem value="ONSITE">Onsite</SelectItem>
                            <SelectItem value="HYBRID">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Country</FieldLabel>
                      <FieldContent>
                        <Input placeholder="Country" {...field} />
                      </FieldContent>
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>City</FieldLabel>
                      <FieldContent>
                        <Input placeholder="City" {...field} />
                      </FieldContent>
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Address</FieldLabel>
                      <FieldContent>
                        <Input placeholder="Address" {...field} />
                      </FieldContent>
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="salaryMin"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Salary Min</FieldLabel>
                      <FieldContent>
                        <Input type="number" {...field} />
                      </FieldContent>
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="salaryMax"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Salary Max</FieldLabel>
                      <FieldContent>
                        <Input type="number" {...field} />
                      </FieldContent>
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Title</FieldLabel>
                      <FieldContent>
                        <Input {...field} />
                      </FieldContent>
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="salaryInterval"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Salary Interval</FieldLabel>
                      <FieldContent>
                        <Select defaultValue={field.value}>
                          <SelectTrigger className="w-36">
                            <SelectValue defaultValue={field.value} />
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
                      <FieldError />
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Experience Level</FieldLabel>
                      <FieldContent>
                        <Select defaultValue={field.value}>
                          <SelectTrigger className="w-36">
                            <SelectValue defaultValue={field.value} />
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
                      <FieldError />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </Form>
      </form>
    </>
  );
}
