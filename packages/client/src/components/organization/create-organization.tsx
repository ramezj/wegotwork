import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { useForm, Controller } from "react-hook-form";
import { createOrganizationSchema } from "@/types/organization/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganizationFn } from "@/features/services/organization/create-organization";
import { BriefcaseBusiness, Loader, PlusIcon } from "lucide-react";
import { useState } from "react";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

export function CreateOrganization() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
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
    onSuccess: async (data: any) => {
      if (data.success === false) {
        toast.error(data.error || "An error occurred");
        // Optionally set the field error specifically on 'slug'
        if (data.error === "Slug is already in use") {
          form.setError("slug", { message: data.error });
        }
        return;
      }
      await queryClient.refetchQueries({ queryKey: ["organizations"] });
      toast.success("Organization successfully created!");
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message || "An error occurred");
    },
  });
  const onSubmit = async (data: z.infer<typeof createOrganizationSchema>) => {
    mutation.mutateAsync({ data });
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="group transition-all ">
            Create Organization
            <PlusIcon className="duration-300 group-hover:rotate-90" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="items-start text-left">
            <DialogTitle className="flex items-center gap-2">
              <BriefcaseBusiness className="size-5" />
              Create Organization
            </DialogTitle>
            <DialogDescription>Define your new organization</DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required htmlFor={field.name}>
                    Name
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      aria-invalid={fieldState.invalid}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue("slug", slugify(e.target.value), {
                          // shouldValidate: true,
                          // shouldDirty: true,
                        });
                      }}
                      placeholder="e.g. Acme Corp"
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="slug"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel required htmlFor="slug">
                    Slug
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      aria-invalid={fieldState.invalid}
                      {...field}
                      placeholder="e.g. acme-corp"
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <div>
              <Button
                disabled={mutation.isPending}
                type="submit"
                className="w-full"
              >
                {mutation.isPending ? (
                  <Loader className="mr-2 size-5 animate-spin" />
                ) : (
                  "Create Organization"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
