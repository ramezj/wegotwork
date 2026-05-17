import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldContent, FieldError } from "../ui/field";
import { Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Save, TriangleAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useNavigate } from "@tanstack/react-router";
import { deleteOrganizationFn } from "@/features/services/organization/delete-organization";
import { useQueryClient } from "@tanstack/react-query";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import type { Organization } from "generated/prisma/client";
import { editOrganizationSchema } from "@/types/organization/schemas";
import { editOrganizationFn } from "@/features/services/organization/edit-organization";
import { uploadLogoFn } from "@/features/services/organization/upload-logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRef, useState } from "react";
import { Layout } from "../shared/layout";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: () => deleteOrganizationFn({ data: { id: organization.id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization deleted successfully");
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete organization");
    },
  });

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
      <Layout
        variant="header"
        title="Edit Organization"
        primaryButton={
          <Button
            type="submit"
            form="edit-organization-form"
            disabled={mutation.isPending || uploadMutation.isPending}
          >
            Save Changes
            {mutation.isPending || uploadMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save />
            )}
          </Button>
        }
      >
        <form
          id="edit-organization-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col space-y-4"
        >
          <Card className="bg-card">
            <CardContent className="flex flex-col space-y-4 px-4">
              <Field>
                <FieldContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="size-32 bg-primary text-primary-foreground">
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
                        <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
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

          <Card className="border-destructive">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 shrink-0">
                <TriangleAlert className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-base">Danger Zone</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Deleting this organization will permanently remove it and all
                its associated data, including jobs, candidates, and team
                members.
              </p>
              <div className="flex items-center justify-between gap-4 rounded-md border border-destructive/20 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Delete organization</p>
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone.
                  </p>
                </div>
                <Dialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="gap-2"
                    >
                      <Trash2 />
                      Delete Organization
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader className="items-start text-left">
                      <DialogTitle>Delete this organization?</DialogTitle>
                      <DialogDescription>
                        This will permanently delete{" "}
                        <strong>{organization.name}</strong> and all of its
                        associated data including jobs and candidates. This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={deleteMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate()}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 />
                        )}
                        Delete Permanently
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </form>
      </Layout>
    </>
  );
}
