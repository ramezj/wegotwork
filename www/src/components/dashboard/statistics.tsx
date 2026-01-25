import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="w-full dark:bg-theme rounded-none border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-foreground font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-medium text-foreground">{amount}</div>
      </CardContent>
    </Card>
  );
}
