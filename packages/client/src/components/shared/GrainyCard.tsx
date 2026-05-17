import { Card } from "@/components/ui/card";
import { TestSVG } from "@/components/shared/svg-test";

export function GrainyCard() {
  return (
    <Card className="relative overflow-hidden">
      {/* SVG background */}
      <TestSVG
        // adjust TestSVG to accept className and pass this through to <svg>
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      />

      {/* Foreground content */}
      <div className="relative z-10 p-6">
        <h2 className="text-lg font-semibold">Card title</h2>
        <p className="text-sm text-muted-foreground">
          Your card content goes here.
        </p>
      </div>
    </Card>
  );
}
