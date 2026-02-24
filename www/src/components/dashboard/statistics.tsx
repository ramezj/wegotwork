import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Briefcase, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatisticsCardsSkeleton() {
  return (
    <>
      <StatisticCardSkeleton />
      <StatisticCardSkeleton />
      <StatisticCardSkeleton />
    </>
  );
}

export function StatisticCardSkeleton() {
  return (
    <Card className="w-full bg-muted/30 hover:bg-muted/50 transition-all rounded-md border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-foreground font-medium">
          <Skeleton className="h-4 w-24" />
        </CardTitle>
        <Skeleton className="size-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

import { Navigate } from "@tanstack/react-router";

export function StatisticsCards({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));
  if (!data?.organization) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <>
      <StatisticCard
        title="Organization"
        amount={data?.organization?.name || ""}
        icon={<Briefcase className="size-4" />}
      />
      <StatisticCard
        title="Jobs"
        amount={data?.organization?.jobs?.length || 0}
        icon={<Briefcase className="size-4" />}
      />
      <StatisticCard
        title="Categories"
        amount={data?.organization?.categories?.length || 0}
        icon={<Users className="size-4" />}
      />
    </>
  );
}

export function StatisticCard({
  title,
  amount,
  icon,
}: {
  title: string;
  amount: number | string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="w-full bg-muted/30 rounded-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-foreground font-bold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{amount}</div>
      </CardContent>
    </Card>
  );
}
