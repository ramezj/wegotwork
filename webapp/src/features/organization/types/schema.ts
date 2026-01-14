import z from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().slugify().min(3, "Slug must be at least 3 characters long"),
});
