import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  office?: {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  };
}

export function OfficeEditorForm({
  mode,
  slug,
  organizationId,
  office,
}: OfficeEditorFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<OfficeFormValues>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      name: office?.name || "",
      address: office?.address || "",
      city: office?.city || "",
      state: office?.state || "",
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
      navigate({ to: "/$slug/offices", params: { slug } });
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
      address: data.address || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
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

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                name="state"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>State / Region</FieldLabel>
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
            </div>

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

            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Street address"
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
                onClick={() => navigate({ to: "/$slug/offices", params: { slug } })}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader className="size-4 animate-spin" />}
                {mode === "create" ? "Create Office" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
