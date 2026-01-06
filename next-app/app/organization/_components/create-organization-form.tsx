"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrganizationSchema } from "@/actions/organization/schemas";
import { z } from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { createOrganizationAction } from "@/actions/organization/create-organization";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function CreateOrganizationForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof createOrganizationSchema>) => {
    setLoading(true);
    const result = await createOrganizationAction(data);
    if (result.error) {
      console.error(result.message);
    }
    setLoading(false);
    redirect("/dash");
  };
  return (
    <Card className="w-[400px] p-4">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldLegend>Organization Information</FieldLegend>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel {...field}>Organization Name</FieldLabel>
                  <Input aria-invalid={!!fieldState.error} {...field}></Input>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="slug"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel {...field}>Organization Slug</FieldLabel>
                  <Input aria-invalid={!!fieldState.error} {...field}></Input>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </FieldGroup>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Organization
          </Button>
        </FieldSet>
      </form>
    </Card>
  );
}
