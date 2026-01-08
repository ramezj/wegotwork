"use client";
import { useQuery } from "@tanstack/react-query";
import { getCurrentOrganizationAction } from "@/actions/organization/get-current-organization";
import AnalyticsCard from "@/components/shared/analytics/card";

export default function DisplayCurrentOrganization() {
  const {
    data: organization,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activeOrganization"],
    queryFn: () => getCurrentOrganizationAction(),
  });

  return (
    <>
      <p>Current Organization: {organization?.name}</p>
      <p>Current Organization slug: {organization?.slug}</p>
      <div className="flex xl:flex-row flex-col w-full gap-4">
        <AnalyticsCard
          cardTitle="Total Jobs"
          cardContent={organization?.jobs.length}
          cardNumber={1}
        />
        <AnalyticsCard
          cardTitle="Total Jobs"
          cardContent={organization?.jobs.length}
          cardNumber={1}
        />
        <AnalyticsCard
          cardTitle="Total Jobs"
          cardContent={organization?.jobs.length}
          cardNumber={1}
        />
        <AnalyticsCard
          cardTitle="Total Jobs"
          cardContent={organization?.jobs.length}
          cardNumber={1}
        />
      </div>
    </>
  );
}
