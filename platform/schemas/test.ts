import { z } from "zod";

// Base fields that are always present
const baseFields = z.object({
  name: z.string().min(1, "Name is required"),
  showPriceOnWebsite: z.boolean().default(false),
});

// Package pricing fields
const PackagePricing = z.object({
  packagePrice: z.number(),
  packageSlots: z.number(),
  packageCost: z.number(),
});

// Slot pricing fields
const SlotPricing = z.object({
  slotPrice: z.number(),
});

// Schema when pricing is NOT checked
const noPricingSchema = baseFields.extend({
  isPricingChecked: z.literal(false),
});

// Schema when pricing IS checked - discriminated by priceType
const withPackagePricingSchema = baseFields.merge(PackagePricing).extend({
  isPricingChecked: z.literal(true),
  priceType: z.literal("package"),
});

const withSlotPricingSchema = baseFields.merge(SlotPricing).extend({
  isPricingChecked: z.literal(true),
  priceType: z.literal("slot"),
});

// Final schema using discriminated unions
export const baseSchema = z.discriminatedUnion("isPricingChecked", [
  noPricingSchema,
  z.discriminatedUnion("priceType", [
    withPackagePricingSchema,
    withSlotPricingSchema,
  ]),
]);
