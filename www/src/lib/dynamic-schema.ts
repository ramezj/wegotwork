import { z } from "zod";
import { FormConfig } from "@/types/form-config";

export function generateDynamicSchema(config: FormConfig) {
  const schemaShape: Record<string, z.ZodTypeAny> = {
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    resumeKey: z.string().min(1, "Resume is required"),
    jobId: z.string().min(1, "Job ID is required"),
  };

  const responsesShape: Record<string, z.ZodTypeAny> = {};

  config.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "SHORT_ANSWER":
      case "LONG_ANSWER":
      case "SELECT":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            1,
            `${field.label} is required`,
          );
        } else {
          fieldSchema = fieldSchema.optional().nullable();
        }
        break;

      case "MULTI_SELECT":
        fieldSchema = z.array(z.string());
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).min(
            1,
            `Please select at least one ${field.label}`,
          );
        } else {
          fieldSchema = fieldSchema.optional().default([]);
        }
        break;

      case "CHECKBOX":
        fieldSchema = z.boolean();
        if (field.required) {
          fieldSchema = z.literal(true, {
            message: `${field.label} must be checked`,
          });
        } else {
          fieldSchema = fieldSchema.optional().default(false);
        }
        break;

      default:
        fieldSchema = z.string().optional().nullable();
    }

    responsesShape[field.id] = fieldSchema;
  });

  schemaShape.responses = z.object(responsesShape);

  return z.object(schemaShape);
}
