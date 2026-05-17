import { BriefcaseBusiness, MapPin, MapPinned } from "lucide-react";

type OfficeCardOffice = {
  id: string;
  name: string;
  city: string | null;
  country: string | null;
  _count: {
    jobs: number;
  };
};

export function OfficeCard({
  office,
  onOpen,
}: {
  office: OfficeCardOffice;
  onOpen: () => void;
}) {
  const location = [office.city, office.country].filter(Boolean).join(", ");

  return (
    <div
      className="group cursor-pointer border bg-secondary p-5 transition-colors rounded-md"
      onClick={onOpen}
    >
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center bg-primary rounded-md text-foreground">
            <MapPinned className="size-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-lg font-semibold tracking-tight">
              {office.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {location || "Location details not added yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-1">
        <div className="border bg-background p-3 rounded-md">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <BriefcaseBusiness className="size-3.5" />
            Linked Jobs
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {office._count.jobs}
          </p>
        </div>

        {/* <div className="border bg-background p-3 rounded-md">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <MapPin className="size-3.5" />
            Office Location
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {office.city || "City"}
          </p>
        </div> */}
      </div>
    </div>
  );
}
