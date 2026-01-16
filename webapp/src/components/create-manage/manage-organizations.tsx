import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateOrganizationButton from "./create-organization";
import { useQuery } from "@tanstack/react-query";

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
      <CardContent>
        {organizations?.organizations?.map((organization: any) => (
          <div key={organization.id}>{organization.name}</div>
        ))}
      </CardContent>
      <CardFooter>
        <CreateOrganizationButton />
      </CardFooter>
    </Card>
  );
}
