import { z } from "zod";

export const formFieldTypeSchema = z.enum([
  "SHORT_ANSWER",
  "LONG_ANSWER",
  "SELECT",
  "MULTI_SELECT",
  "FILE",
  "CHECKBOX",
]);

export type FormFieldType = z.infer<typeof formFieldTypeSchema>;

export const formFieldConfigSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: formFieldTypeSchema,
  required: z.boolean().default(false),
  placeholder: z.string().optional().nullable(),
  options: z.array(z.string()).default([]), // For SELECT and MULTI_SELECT
  order: z.number().default(0),
});

export type FormFieldConfig = z.infer<typeof formFieldConfigSchema>;

export const formConfigSchema = z.array(formFieldConfigSchema);

export type FormConfig = z.infer<typeof formConfigSchema>;
