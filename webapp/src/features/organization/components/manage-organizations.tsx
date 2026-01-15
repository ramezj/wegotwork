import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateOrganizationButton from "./create-organization";
import { useQuery } from "@tanstack/react-query";
import { getAllOrganizationsFn } from "../actions/get-all-organizations";

export default function ManageOrganizations() {
  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    queryFn: getAllOrganizationsFn,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
      </CardHeader>
      <CardContent>
        {organizations?.organizations?.map((organization) => (
          <div key={organization.id}>{organization.name}</div>
        ))}
      </CardContent>
      <CardFooter>
        <CreateOrganizationButton />
      </CardFooter>
    </Card>
  );
}
