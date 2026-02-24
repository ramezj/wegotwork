import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationBySlugQueryOptions } from "@/features/queries/organization";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function RecentApplicants({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(organizationBySlugQueryOptions(slug));

  const allApplicants =
    data?.organization?.jobs
      .flatMap((job: any) =>
        job.applicants.map((app: any) => ({ ...app, jobTitle: job.title })),
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5) || [];

  return (
    <Card className="w-full border rounded-md shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Applicants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allApplicants.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent applicants found.
            </p>
          ) : (
            allApplicants.map((applicant: any) => (
              <div
                key={applicant.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">{applicant.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {applicant.jobTitle}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase font-bold rounded-md"
                  >
                    {applicant.status}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(applicant.createdAt))} ago
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
