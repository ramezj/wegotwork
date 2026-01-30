import { Form, useForm } from "react-hook-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/queries/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobWithCategory } from "@/types/job";
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
import { Button } from "../ui/button";
import z from "zod";
import { Card, CardContent } from "../ui/card";
import { JobCategory } from "generated/prisma/client";

export function EditJobForm({
  job,
  categories,
}: {
  job: JobWithCategory;
  categories: JobCategory[];
}) {
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

  const onSubmit = (data: z.infer<typeof jobSchema>) => {
    console.log(data);
  };
  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Card>
                <CardContent className="flex flex-col space-y-4 px-4">
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
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FULLTIME">
                                Full Time
                              </SelectItem>
                              <SelectItem value="PARTTIME">
                                Part Time
                              </SelectItem>
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
                    name="status"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Status</FieldLabel>
                        <FieldContent>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="PUBLISHED">
                                Published
                              </SelectItem>
                              <SelectItem value="CLOSED">Closed</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldContent>
                        <FieldError />
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Category</FieldLabel>
                        <FieldContent>
                          <Select
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
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FieldContent>
                        <FieldError />
                      </Field>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col gap-4">
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
                    name="locationMode"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Location Mode</FieldLabel>
                        <FieldContent>
                          <Select
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
                        <FieldError />
                      </Field>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col gap-4">
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
                    name="salaryInterval"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Salary Interval</FieldLabel>
                        <FieldContent>
                          <Select
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
                              <SelectItem value="QUARTERLY">
                                Quarterly
                              </SelectItem>
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
                          <Select
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
                              <SelectItem value="EXECUTIVE">
                                Executive
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FieldContent>
                        <FieldError />
                      </Field>
                    )}
                  />
                </CardContent>
              </Card>
            </FieldGroup>
          </FieldSet>
          <Button type="submit">Update Job Details</Button>
        </FieldGroup>
      </form>
    </>
  );
}
