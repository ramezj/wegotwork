"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { baseSchema } from "@/schemas/test";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type FormValues = z.infer<typeof baseSchema>;

export function PricingForm() {
  const form = useForm<any>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: "",
      showPriceOnWebsite: false,
      isPricingChecked: false,
    },
  });

  const formValues = form.watch();
  const isPricingChecked = formValues.isPricingChecked;
  const priceType = formValues.priceType;

  function onSubmit(values: FormValues) {
    console.log("Form submitted with values:", values);
    alert("Form submitted successfully! Check console for values.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Show Price on Website Checkbox */}
        <FormField
          control={form.control}
          name="showPriceOnWebsite"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Show price on website</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Pricing Checked Checkbox */}
        <FormField
          control={form.control}
          name="isPricingChecked"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    // Reset form when unchecking
                    if (!checked) {
                      form.reset({
                        name: form.getValues("name"),
                        showPriceOnWebsite:
                          form.getValues("showPriceOnWebsite"),
                        isPricingChecked: false,
                      });
                    }
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Include pricing</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Price Type Selection - Only shown when isPricingChecked is true */}
        {isPricingChecked && (
          <FormField
            control={form.control}
            name="priceType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Price Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="package" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Package Pricing
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="slot" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Slot Pricing
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Package Pricing Fields - Only shown when priceType is "package" */}
        {isPricingChecked && priceType === "package" && (
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">Package Pricing Details</h3>

            <FormField
              control={form.control}
              name="packagePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        field.onChange(isNaN(val) ? 0 : val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="packageSlots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Slots</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        field.onChange(isNaN(val) ? 0 : val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="packageCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        field.onChange(isNaN(val) ? 0 : val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Slot Pricing Fields - Only shown when priceType is "slot" */}
        {isPricingChecked && priceType === "slot" && (
          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold">Slot Pricing Details</h3>

            <FormField
              control={form.control}
              name="slotPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slot Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={field.value || ""}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        field.onChange(isNaN(val) ? 0 : val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
