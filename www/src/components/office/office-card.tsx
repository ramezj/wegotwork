import { Link } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  MapPin,
  MapPinned,
  MoreVertical,
  Settings2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  slug,
  office,
  onOpen,
  onDelete,
}: {
  slug: string;
  office: OfficeCardOffice;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const location = [office.city, office.country].filter(Boolean).join(", ");

  return (
    <div
      className="group cursor-pointer border bg-background p-5 transition-colors hover:bg-muted/30"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center border bg-muted/50 text-foreground">
            <MapPinned className="size-5" />
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                to="/$slug/offices/$officeId"
                params={{ slug, officeId: office.id }}
                onClick={(event) => event.stopPropagation()}
                className="cursor-pointer"
              >
                <Settings2 className="size-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-destructive"
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="border bg-muted/20 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <BriefcaseBusiness className="size-3.5" />
            Linked Jobs
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight">
            {office._count.jobs}
          </p>
        </div>

        <div className="border bg-muted/20 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <MapPin className="size-3.5" />
            Office Location
          </div>
          <p className="mt-2 text-sm font-medium text-foreground">
            {location || "Add city and country"}
          </p>
        </div>
      </div>
    </div>
  );
}
