import { z } from "zod";

export const dashSchema = z.object({
  slug: z.string().min(3, "slug must be at least 3 characters long.").slugify(),
});
