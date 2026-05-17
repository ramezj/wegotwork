import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateOfficeFn } from "@/features/services/office/office";
import { officeSchema } from "@/types/organization/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type OfficeFormValues = z.infer<typeof officeSchema>;

interface OfficeEditorFormProps {
  slug: string;
  organizationId: string;
  office: {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
  };
}

export function OfficeEditorForm({
  slug,
  organizationId,
  office,
}: OfficeEditorFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<OfficeFormValues>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      name: office.name,
      city: office.city || "",
      country: office.country || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateOfficeFn,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["offices", organizationId],
      });
      await queryClient.refetchQueries({
        queryKey: ["organization", slug],
      });
      toast.success("Office updated successfully");
      navigate({ to: "/$slug/offices", params: { slug } });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update office");
    },
  });

  const isPending = updateMutation.isPending;

  const onSubmit = async (data: OfficeFormValues) => {
    const payload = {
      ...data,
      city: data.city || undefined,
      country: data.country || undefined,
    };

    await updateMutation.mutateAsync({
      data: {
        id: office.id,
        office: payload,
      },
    });
  };

  return (
    <form
      id="edit-office-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className=""
    >
      <Card className="p-4">
        <div className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel required>Office Name</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. New York Office"
                    disabled={isPending}
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
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. New York"
                    disabled={isPending}
                  />
                </FieldContent>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="country"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Country</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. United States"
                    disabled={isPending}
                  />
                </FieldContent>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
      </Card>
    </form>
  );
}
