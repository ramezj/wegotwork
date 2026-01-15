import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganizationFn } from "../actions/create-organization";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { createOrganizationSchema } from "../types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateOrganizationButton() {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
    },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: createOrganizationFn,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["organizations"] });
      form.reset({
        name: "",
        slug: "",
      });
      // router.invalidate();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const onSubmit = (data: z.infer<typeof createOrganizationSchema>) => {
    mutation.mutate({ data });
  };

  return (
    <Card className="flex flex-col gap-4">
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldLegend>Organization Information</FieldLegend>
            <FieldDescription>
              This information will be your organization's information
            </FieldDescription>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        placeholder="Organization Name"
                        aria-invalid={!!fieldState.error}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Slug</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        placeholder="Organization Slug"
                        aria-invalid={!!fieldState.error}
                      />
                      <FieldError errors={[fieldState.error]} />
                    </FieldContent>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Organization"}
          </Button>
        </form>
        {mutation.isSuccess && (
          <div className="text-sm text-green-600">
            Organization created successfully!
          </div>
        )}
        {mutation.isError && (
          <div className="text-sm text-destructive">
            Failed to create organization. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
