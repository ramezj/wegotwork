import z from "zod";

export const organizationSettings = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  website: z.string().optional(),
  description: z.string().optional(),
});
