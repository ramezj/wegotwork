"use client";
import { useQuery } from "@tanstack/react-query";
import { getActiveOrganizationFn } from "@/features/organization/actions/get-active-organization";
import AnalyticsCard from "@/components/dash/analytics-card";

export default function DisplayCurrentOrganization() {
  const { data: organization } = useQuery({
    queryKey: ["activeOrganization"],
    queryFn: getActiveOrganizationFn,
  });

  return (
    <main className="space-y-4">
      <p className="text-muted-foreground">
        Welcome back! Here is what's happening with{" "}
        {organization?.organization?.name} today.
      </p>
      <div className="flex xl:flex-row flex-col w-full gap-4">
        <AnalyticsCard cardTitle="Total Jobs" cardContent={1} cardNumber={1} />
        <AnalyticsCard
          cardTitle="Total Applicants"
          cardContent={2}
          cardNumber={1}
        />
        <AnalyticsCard
          cardTitle="Total Categories"
          cardContent={3}
          cardNumber={1}
        />
        <AnalyticsCard cardTitle="Total Jobs" cardContent={4} cardNumber={1} />
      </div>
    </main>
  );
}
