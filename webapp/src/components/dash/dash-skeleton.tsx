import { Card, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashSkeleton() {
  return (
    <main className="space-y-4">
      <Skeleton className="h-5 w-96 max-w-full" />
      <div className="flex xl:flex-row flex-col w-full gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Skeleton className="h-8 w-32" />
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
