import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  createOfficeFn,
  updateOfficeFn,
} from "@/features/services/office/office";
import { officeSchema } from "@/types/organization/schemas";

type OfficeFormValues = z.infer<typeof officeSchema>;

interface OfficeEditorFormProps {
  mode: "create" | "edit";
  slug: string;
  organizationId: string;
  onCreated?: () => void;
  onCancel?: () => void;
  wrapInCard?: boolean;
  office?: {
    id: string;
    name: string;
    city: string | null;
    country: string | null;
  };
}

export function OfficeEditorForm({
  mode,
  slug,
  organizationId,
  onCreated,
  onCancel,
  wrapInCard = true,
  office,
}: OfficeEditorFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<OfficeFormValues>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      name: office?.name || "",
      city: office?.city || "",
      country: office?.country || "",
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

  const isPending =
    mode === "create" ? createMutation.isPending : updateMutation.isPending;

  const onSubmit = async (data: OfficeFormValues) => {
    const payload = {
      ...data,
      city: data.city || undefined,
      country: data.country || undefined,
    };

    if (mode === "create") {
      await createMutation.mutateAsync({
        data: {
          organizationId,
          office: payload,
        },
      });
      return;
    }

    if (!office) return;

    await updateMutation.mutateAsync({
      data: {
        id: office.id,
        office: payload,
      },
    });
  };

  const formContent = (
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

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => {
            if (onCancel) {
              onCancel();
              return;
            }
            navigate({ to: "/$slug/offices", params: { slug } });
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader className="size-4 animate-spin" />}
          {mode === "create" ? "Create Office" : "Save Changes"}
        </Button>
      </div>
    </form>
  );

  if (!wrapInCard) {
    return formContent;
  }

  return <div className="rounded-lg border p-6">{formContent}</div>;
}
