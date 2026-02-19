import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobWithCategory } from "@/types/job/job";
import { jobSchema } from "@/types/job/job";
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
import { editOrganizationSchema } from "@/types/organization/schemas";
import { editOrganizationFn } from "@/features/services/organization/edit-organization";
import { uploadLogoFn } from "@/features/services/organization/upload-logo";
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

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoValue = form.watch("logo");

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
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

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("logo", file);
      return uploadLogoFn({ data: formData });
    },
  });

  const handleSubmit = async (
    values: z.infer<typeof editOrganizationSchema>,
  ) => {
    let logoUrl = values.logo;

    if (selectedFile) {
      try {
        const uploadResult = (await uploadMutation.mutateAsync(
          selectedFile,
        )) as { url: string };
        logoUrl = uploadResult.url;
      } catch (error: any) {
        toast.error(error.message || "Failed to upload logo");
        return;
      }
    }

    await mutation.mutateAsync({
      ...values,
      logo: logoUrl,
    });
  };
  return (
    <>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl">Edit Organization</h1>
        <Button
          type="submit"
          form="edit-organization-form"
          disabled={mutation.isPending || uploadMutation.isPending}
        >
          {(mutation.isPending || uploadMutation.isPending) && (
            <Loader className="animate-spin mr-2 size-4" />
          )}
          {mutation.isPending || uploadMutation.isPending
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </div>
      <form
        id="edit-organization-form"
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col space-y-4"
      >
        <Card className="bg-black">
          <CardContent className="flex flex-col space-y-4 px-4">
            <Field>
              <FieldContent>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="size-32 rounded-none">
                      <AvatarImage
                        src={
                          preview
                            ? preview
                            : logoValue
                              ? `${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${logoValue}`
                              : undefined
                        }
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
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-32 text-destructive hover:text-destructive"
                      onClick={() => {
                        setPreview(null);
                        setSelectedFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                        form.setValue("logo", "");
                      }}
                    >
                      Remove
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
                    <Input
                      id="input-group-url"
                      placeholder="https://example.com"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
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
