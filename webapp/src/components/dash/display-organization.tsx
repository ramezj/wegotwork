import AnalyticsCard from "@/components/dash/analytics-card";
import { Organization } from "generated/prisma/client";

export default function DisplayCurrentOrganization({
  organization,
}: // slug,
{
  organization: Organization;
  // slug: string;
}) {
  return (
    <main className="space-y-4">
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
