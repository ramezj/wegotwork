import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Organization } from "generated/prisma/client";
import { Link } from "@tanstack/react-router";
import { Building2, ArrowRight } from "lucide-react";

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
      <Card className="h-full border-border/50 bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-lg hover:border-primary/20 overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl truncate group-hover:text-primary transition-colors">
                  {organization.name}
                </CardTitle>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground ">
            <span className="px-2 py-1 rounded-none text-xs bg-primary/10">
              /{organization.slug}
            </span>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t">
          <div className="flex items-center text-sm font-medium text-primary group-hover:underline">
            View Dashboard
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
