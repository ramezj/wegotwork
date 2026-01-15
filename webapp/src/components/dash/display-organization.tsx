import { useSuspenseQuery } from "@tanstack/react-query";
import { getDashFn } from "@/features/dash/get-dash";
import AnalyticsCard from "@/components/dash/analytics-card";

export default function DisplayCurrentOrganization() {
  const { data: organization } = useSuspenseQuery({
    queryKey: ["dash"],
    queryFn: getDashFn,
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
