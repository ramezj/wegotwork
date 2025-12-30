import { TestAction } from "@/actions/test";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { DashboardContent } from "./dashboard-content";

// This is a Server Component - it runs on the server
export default async function Page() {
  // Create a new QueryClient instance for this request
  const queryClient = new QueryClient();

  // Prefetch the data on the server
  await queryClient.prefetchQuery({
    queryKey: ["test"],
    queryFn: TestAction,
  });

  return (
    // Dehydrate the query data and pass it to the client
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardContent />
    </HydrationBoundary>
  );
}
