import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrganizationBySlugFn } from "@/server/organization/get-by-slug";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Briefcase, Users } from "lucide-react";
import { motion } from "motion/react";

export function StatisticsCards({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ["organization", slug],
    queryFn: () => getOrganizationBySlugFn({ data: { slug } }),
  });
  return (
    <>
      <StatisticCard
        title="Organization"
        amount={data?.organization?.name || ""}
        icon={<Briefcase className="size-4" />}
        slug={slug}
      />
      <StatisticCard
        title="Jobs"
        amount={data?.organization?.jobs?.length || 0}
        icon={<Briefcase className="size-4" />}
        slug={slug}
      />
      <StatisticCard
        title="Categories"
        amount={data?.organization?.categories?.length || 0}
        icon={<Users className="size-4" />}
        slug={slug}
      />
    </>
  );
}

export function StatisticCard({
  title,
  amount,
  icon,
  slug,
}: {
  title: string;
  amount: number | string;
  icon: React.ReactNode;
  slug: string;
}) {
  return (
    <Card className="w-full dark:bg-theme rounded-none border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-foreground font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-medium text-foreground">{amount}</div>
      </CardContent>
    </Card>
  );
}
