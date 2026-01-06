import { getCurrentOrganizationAction } from "@/actions/organization/get-current-organization";
import { useUser } from "@/lib/use-user";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import DisplayCurrentOrganization from "../_components/ui/display-current-org";

export default async function Page() {
  const queryClient = new QueryClient();
  const session = await useUser();
  if (!session) {
    redirect("/");
  }
  if (session.session.activeOrganizationId === null) {
    redirect("/dashboard");
  }
  await queryClient.prefetchQuery({
    queryKey: ["activeOrganization"],
    queryFn: () => getCurrentOrganizationAction(),
  });
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DisplayCurrentOrganization />
      </HydrationBoundary>
    </>
  );
}
