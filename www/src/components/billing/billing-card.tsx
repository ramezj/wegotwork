import { authClient } from "@/features/auth/auth-client";
import { Card, CardContent } from "../ui/card";

export function BillingCard() {
  const { data: session } = authClient.useSession();

  const plan = (session?.user as any)?.plan || "FREE";

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="font-medium">
          You are currently subscribed to the{" "}
          <span className="font-bold text-primary">{plan.toLowerCase()}</span>{" "}
          plan
        </p>
      </CardContent>
    </Card>
  );
}
