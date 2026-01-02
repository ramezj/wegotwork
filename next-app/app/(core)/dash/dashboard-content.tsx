"use client";
import { TestAction } from "@/actions/test";
export function DashboardContent({ data }: { data: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <p>Data from server action: {data}</p>
      </div>
    </div>
  );
}
