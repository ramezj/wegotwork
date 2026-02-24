import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Organization } from "generated/prisma/client";
import { Link } from "@tanstack/react-router";
import { Building2, ArrowRight, ArrowUpRight } from "lucide-react";

export function OrganizationCard({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <Link
      to="/$slug"
      params={{ slug: organization.slug }}
      className="group block h-full"
    >
      <Card className="h-full border bg-card hover:bg-muted/30 transition-all shadow-sm overflow-hidden rounded-md">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted border text-primary transition-colors duration-300">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl truncate group-hover:text-primary transition-colors font-semibold">
                  {organization.name}
                </CardTitle>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-foreground group-hover:text-primary shrink-0 duration-100 group-hover:-rotate-45" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground ">
            <span className="px-2 py-1 rounded-md text-xs bg-muted border text-muted-foreground font-medium">
              /{organization.slug}
            </span>
          </div>
        </CardContent>

        <CardFooter className="border-t">
          <div className="flex items-center text-sm font-medium text-primary">
            View Organization
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
