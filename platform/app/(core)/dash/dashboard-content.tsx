"use client";

import { TestAction } from "@/actions/test";
import { useSuspenseQuery } from "@tanstack/react-query";

// This is a Client Component - it runs on the client
export function DashboardContent() {
  // This will use the prefetched data from the server
  // No loading state needed because useSuspenseQuery + prefetch = instant data
  const { data } = useSuspenseQuery({
    queryKey: ["test"],
    queryFn: TestAction,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <p>Data from server action: {data}</p>
      </div>
    </div>
  );
}
