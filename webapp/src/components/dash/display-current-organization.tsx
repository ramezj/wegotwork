import { getActiveOrganizationFn } from "@/features/organization/actions/get-active-organization";
import { QueryClient, useQuery } from "@tanstack/react-query";

export default function DisplayCurrentOrganization() {
  const { data: organization } = useQuery({
    queryKey: ["activeOrganization"],
    queryFn: getActiveOrganizationFn,
  });
  return <>{organization?.organization?.name}</>;
}
