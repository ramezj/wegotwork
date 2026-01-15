import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";

type AnalayticsProps = {
  cardTitle: string;
  cardContent: any;
  cardNumber: number;
};

export default function AnalyticsCard({
  cardTitle,
  cardContent,
  cardNumber,
}: AnalayticsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        {/* <CardDescription>Total Revenue</CardDescription> */}
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {cardTitle}
        </CardTitle>
        {/* <CardAction>
          <Badge variant="outline">
            {cardNumber}
          </Badge>
        </CardAction> */}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month
        </div>
        <div className="text-muted-foreground">
          Visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
