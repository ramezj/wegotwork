import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Organization } from "generated/prisma/client";
import { Link } from "@tanstack/react-router";

export function OrganizationCard({
  organization,
}: {
  organization: Organization;
}) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
        {/* <CardDescription>
          This card uses the small size variant.
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        {/* <p>
          The card component supports a size prop that can be set to
          &quot;sm&quot; for a more compact appearance.
        </p> */}
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/$slug" params={{ slug: organization.slug }}>
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
