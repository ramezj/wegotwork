import z from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().slugify().min(3, "Slug must be at least 3 characters long"),
});

export const getOrganizationBySlugSchema = z.object({
  slug: z.string(),
  limit: z.number().optional(),
});

export const editOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().slugify().min(3, "Slug must be at least 3 characters long"),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

export const getOrganizationTeamSchema = z.object({
  slug: z.string(),
});

export const inviteOrganizationMemberSchema = z.object({
  slug: z.string(),
  email: z.string().email(),
  role: z.enum(["owner", "admin", "member"]).optional(),
});

export const officeSchema = z.object({
  name: z.string().min(1, "Office name is required"),
  city: z.string().optional(),
  country: z.string().optional(),
});
