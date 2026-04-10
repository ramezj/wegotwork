import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Organization } from "generated/prisma/client";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";

function getOrganizationLogoSrc(logo?: string | null) {
  if (!logo) return undefined;
  return `${process.env.R2_PUBLIC_URL || "https://pub-c33c43f7f06946a1ba713658430b64ad.r2.dev"}/${logo}`;
}

export function OrganizationCard({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <Link
      to="/$slug/jobs"
      params={{ slug: organization.slug }}
      className="group block h-full"
    >
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 shrink-0 rounded-md">
                <AvatarImage
                  src={getOrganizationLogoSrc(organization.logo)}
                  alt={organization.name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-md bg-primary text-primary-foreground p-0 overflow-hidden">
                  {organization.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl truncate group-hover:text-primary transition-colors font-semibold">
                  {organization.name}
                </CardTitle>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-foreground group-hover:text-primary shrink-0 duration-100 -rotate-45 group-hover:rotate-0" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {organization.plan === "PREMIUM" ? (
              <Badge variant={"outline"} className="bg-background">
                <Sparkles className="h-3 w-3" />
                Premium
              </Badge>
            ) : (
              <Badge variant={"outline"} className="bg-background">
                Free
              </Badge>
            )}
            <Badge variant={"default"}>/{organization.slug}/jobs</Badge>
          </div>
        </CardContent>

        <CardFooter className="border-t">
          <div className="flex items-center text-sm font-semibold text-primary">
            View Organization
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
