import { Badge } from "@/components/ui/badge";
import { Status } from "generated/prisma/client";

const statusConfig: Record<
  Status,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "outline"
      | "destructive"
      | "success"
      | "warning";
  }
> = {
  SUBMITTED: { label: "Submitted", variant: "secondary" },
  UNDERREVIEW: { label: "Under Review", variant: "warning" as any },
  INTERVIEW: { label: "Interview", variant: "default" },
  OFFER: { label: "Offer", variant: "success" as any },
  REJECTED: { label: "Rejected", variant: "destructive" },
  HIRED: { label: "Hired", variant: "success" as any },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant as any} className="rounded-sm font-medium">
      {config.label}
    </Badge>
  );
}
