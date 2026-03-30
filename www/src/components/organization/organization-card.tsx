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
      to="/$slug"
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
            <ArrowRight className="h-5 w-5 text-foreground group-hover:text-primary shrink-0 duration-100 group-hover:-rotate-45" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {organization.plan === "PREMIUM" ? (
              <Badge variant={"secondary"} className="">
                <Sparkles className="h-3 w-3" />
                Premium
              </Badge>
            ) : (
              <Badge variant={"secondary"} className="">
                Free
              </Badge>
            )}
            <Badge variant={"outline"}>/{organization.slug}</Badge>
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
