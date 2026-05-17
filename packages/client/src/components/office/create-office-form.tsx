import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createOfficeFn } from "@/features/services/office/office";
import { officeSchema } from "@/types/organization/schemas";

type OfficeFormValues = z.infer<typeof officeSchema>;

interface CreateOfficeFormProps {
  slug: string;
  organizationId: string;
  onCreated?: () => void;
}

export function CreateOfficeForm({
  slug,
  organizationId,
  onCreated,
}: CreateOfficeFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<OfficeFormValues>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      name: "",
      city: "",
      country: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: createOfficeFn,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["offices", organizationId],
      });
      await queryClient.refetchQueries({
        queryKey: ["organization", slug],
      });
      toast.success("Office created successfully");
      onCreated?.();
      if (!onCreated) {
        navigate({ to: "/$slug/offices", params: { slug } });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create office");
    },
  });

  const onSubmit = async (data: OfficeFormValues) => {
    const payload = {
      ...data,
      city: data.city || undefined,
      country: data.country || undefined,
    };

    await createMutation.mutateAsync({
      data: {
        organizationId,
        office: payload,
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                disabled={createMutation.isPending}
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
                disabled={createMutation.isPending}
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
                disabled={createMutation.isPending}
              />
            </FieldContent>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Button
        type="submit"
        disabled={createMutation.isPending}
        className="w-full"
      >
        Create Office
        {createMutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <PlusIcon className="size-4" />
        )}
      </Button>
    </form>
  );
}
