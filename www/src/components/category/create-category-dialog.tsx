import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "@/types/job/job";
import { createCategoryFn } from "@/features/services/category/create-category";
import z from "zod";
import { getOrganizationCategoriesQuery } from "@/features/queries/category";
import { toast } from "sonner";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Loader, PlusIcon } from "lucide-react";
import { useState } from "react";

export function CreateCategoryDialog({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(categorySchema),
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof categorySchema>) =>
      createCategoryFn({ data: { slug, category: data } }),
    onSuccess: async () => {
      await queryClient.refetchQueries(getOrganizationCategoriesQuery(slug));
      toast.success("Category created successfully");
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: z.infer<typeof categorySchema>) => {
    mutation.mutateAsync(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="group">
          Create Category
          <PlusIcon className="duration-100 group-hover:rotate-90" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Add a new job category to organize your roles.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Category Name</FieldLabel>
                <FieldContent>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="Engineering"
                    {...field}
                  />
                </FieldContent>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Button
            disabled={mutation.isPending}
            className="w-full"
            type="submit"
          >
            {mutation.isPending && <Loader className="animate-spin" />}
            Create Category
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
