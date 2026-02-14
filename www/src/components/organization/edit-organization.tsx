import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobWithCategory } from "@/features/types/job/job";
import { jobSchema } from "@/features/types/job/job";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { JobCategory } from "generated/prisma/client";
import { useMutation } from "@tanstack/react-query";
import { editJobBySlugFn } from "@/features/services/jobs/edit-by-slug";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { jobByIdQueryOptions } from "@/features/queries/jobs";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { Organization } from "generated/prisma/client";
import { editOrganizationSchema } from "@/features/types/organization/schemas";
import { editOrganizationFn } from "@/features/services/organization/edit-organization";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";

export function EditOrganizationForm({
  organization,
}: {
  organization: Organization;
}) {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(editOrganizationSchema),
    defaultValues: {
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo || "",
      website: organization.website || "",
      description: organization.description || "",
    },
  });

  const [preview, setPreview] = useState<string | null>(organization.logo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        // In a real app, you might set the file to a form field or local state
        // For now, we are just previewing.
      };
      reader.readAsDataURL(file);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof editOrganizationSchema>) =>
      editOrganizationFn({ data: { id: organization.id, data } }),
    onSuccess: () => {
      toast.success("Organization updated successfully");
      queryClient.invalidateQueries({
        queryKey: organizationBySlugQueryOptions(organization.slug).queryKey,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update organization");
    },
  });

  const handleSubmit = async (data: z.infer<typeof editOrganizationSchema>) => {
    await mutation.mutateAsync(data);
  };
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">Edit Organization</h1>
        <Button
          type="submit"
          form="edit-organization-form"
          disabled={mutation.isPending}
        >
          {mutation.isPending && (
            <Loader className="animate-spin mr-2 size-4" />
          )}
          Save Changes
        </Button>
      </div>
      <form
        id="edit-organization-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-4"
      >
        <Card>
          <CardContent className="flex flex-col space-y-4 px-4">
            <Field>
              <FieldContent>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="size-32 rounded-none">
                      <AvatarImage
                        src={preview || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-white text-black text-4xl rounded-none border border-border">
                        {form.getValues("name")?.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-32"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Change Logo
                    </Button>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={onFileChange}
                    />
                  </div>
                </div>
              </FieldContent>
            </Field>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <FieldContent>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Organization Name"
                      {...field}
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
                  <FieldLabel>Slug</FieldLabel>
                  <FieldContent>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Organization Slug"
                      {...field}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="website"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Website</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        id="input-group-url"
                        placeholder="example.com"
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      <InputGroupAddon>
                        <InputGroupText>https://</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <FieldContent>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Organization Description"
                      {...field}
                    />
                  </FieldContent>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </>
  );
}
