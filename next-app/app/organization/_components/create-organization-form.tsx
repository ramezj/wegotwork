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
import { createOrganizationAction } from "@/actions/organization/create-organization";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateOrganizationForm() {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createOrganizationAction,
    onSuccess: (result) => {
      if (result.error) {
        console.error(result.message);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["activeOrganization"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const onSubmit = (data: z.infer<typeof createOrganizationSchema>) => {
    mutation.mutate(data);
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
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Organization
          </Button>
        </FieldSet>
      </form>
    </Card>
  );
}
