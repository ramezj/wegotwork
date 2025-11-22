"use client";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Organization } from "@prisma/client";
import { useState, useEffect } from "react";
import { EditOrganization } from "@/actions/organization/edit-organization";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { organizationSettings } from "@/schemas/organization-settings";
import { Form, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldLabel,
  FieldSet,
  Field,
} from "../ui/field";
import { Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function SettingsCard({ organization }: { organization: Organization }) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(organizationSettings),
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
      website: organization.website || "",
      description: organization.description,
    },
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof organizationSettings>) => {
      return await EditOrganization(organization, data);
    },
    onSuccess: (response) => {
      if (response?.error) {
        toast.error(response.message as string);
      } else {
        toast.success(response?.message as string);
        // Invalidate and refetch organization data
        queryClient.invalidateQueries({ queryKey: ["user-organization"] });
      }
    },
    onError: (error) => {
      toast.error("Failed to update organization");
      console.error(error);
    },
  });

  const onSubmit = async (data: z.infer<typeof organizationSettings>) => {
    mutation.mutate(data);
  };

  const [current, setCurrent] = useState<Organization>(organization);
  const [loading, setLoading] = useState<boolean>(false);

  // Update current state when organization prop changes
  useEffect(() => {
    setCurrent(organization);
  }, [organization]);
  return (
    <Card className="w-full dark:bg-theme bg-gray-200 rounded-none border border-dashed">
      <CardHeader>
        <CardTitle className="text-foreground font-extrabold">
          Organization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Enter organization name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                control={form.control}
                name="slug"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Enter organization slug"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      {...field}
                      placeholder="Enter organization description"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                control={form.control}
                name="website"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="website">Website</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Enter organization website"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button
              disabled={mutation.isPending}
              type="submit"
              className="w-36"
            >
              Submit
              {mutation.isPending && (
                <Loader2 className="size-4 animate-spin ml-2" />
              )}
            </Button>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
