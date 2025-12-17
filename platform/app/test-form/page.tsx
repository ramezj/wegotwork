import { PricingForm } from "@/components/pricing-form";

export default function TestFormPage() {
  return (
    <div className="container mx-auto max-w-2xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pricing Form Test</h1>
        <p className="text-muted-foreground mt-2">
          Test the conditional pricing form with discriminated union validation
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <PricingForm />
      </div>

      <div className="mt-8 space-y-4 rounded-lg border bg-muted/50 p-6">
        <h2 className="text-xl font-semibold">Testing Instructions</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm">
          <li>Submit with empty name - should show validation error</li>
          <li>
            Check "Include pricing" checkbox to reveal price type selection
          </li>
          <li>
            Select "Package Pricing" to show package fields (price, slots, cost)
          </li>
          <li>Select "Slot Pricing" to show slot price field</li>
          <li>
            Try submitting with incomplete pricing fields - should show
            validation errors
          </li>
          <li>Submit with complete valid data - should log to console</li>
        </ul>
      </div>
    </div>
  );
}
