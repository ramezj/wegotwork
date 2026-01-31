import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "../ui/field";
import { useForm, Controller } from "react-hook-form";
import { createOrganizationSchema } from "@/features/types/organization/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "../ui/input";
import { useMutation } from "@tanstack/react-query";
import { createOrganizationFn } from "@/features/services/organization/create-organization";
import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function CreateOrganization() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
    mode: "onSubmit",
  });
  const mutation = useMutation({
    mutationFn: createOrganizationFn,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["organizations"] });
      console.log("Done!");
    },
  });
  const onSubmit = async (data: z.infer<typeof createOrganizationSchema>) => {
    mutation.mutateAsync({ data });
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create New Organization</Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Create Organization</FieldLegend>
                <FieldDescription>
                  Create an organization and start hiring
                </FieldDescription>
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input {...field} placeholder="Name" />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="slug"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                        <Input {...field} placeholder="Slug" />
                        {fieldState.error && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Button disabled={mutation.isPending} type="submit">
                    {mutation.isPending && <Loader className="animate-spin" />}
                    Create
                  </Button>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
