import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateOrganizationButton from "./create-organization";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";
import { setActiveOrganizationFn } from "@/features/dash/set-active-organization";

export default function ManageOrganizations() {
  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => {
      return fetch("/api/organizations").then((res) => res.json());
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {organizations?.organizations?.map((organization: any) => (
          <div
            key={organization.id}
            className="flex items-center justify-between"
          >
            <p>{organization.name}</p>
            <Button asChild>
              <Link
                to={"/$slug/dash"}
                params={{ slug: organization.slug }}
                onClick={() =>
                  setActiveOrganizationFn({
                    data: {
                      organizationId: organization.id,
                      organizationSlug: organization.slug,
                    },
                  })
                }
              >
                View
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <CreateOrganizationButton />
      </CardFooter>
    </Card>
  );
}
