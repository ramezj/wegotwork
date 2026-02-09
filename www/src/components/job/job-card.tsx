import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";
import { JobWithCategory } from "@/features/types/job/job";
import { Separator } from "../ui/separator";

const formatLocationMode = (mode: string) => {
  const map: Record<string, string> = {
    ONSITE: "On Site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };
  return map[mode] || mode;
};

const formatJobType = (type: string) => {
  const map: Record<string, string> = {
    FULLTIME: "Full Time",
    PARTTIME: "Part Time",
    INTERNSHIP: "Internship",
    CONTRACT: "Contract",
  };
  return map[type] || type;
};

export function JobCard({
  job,
  slug,
  isDemo,
}: {
  job: JobWithCategory;
  slug: string;
  isDemo?: boolean;
}) {
  return (
    <Link
      to={isDemo ? "/" : "/$slug/jobs/$jobId"}
      params={{ slug, jobId: job.id }}
    >
      <Card className="w-full bg-input/30 hover:bg-input/50 transition-all flex flex-row border rounded-none items-center p-5 cursor-pointer shadow-none gap-0">
        <div className="flex flex-col items-start text-left py-2">
          <p className="sm:text-lg text-md font-medium text-left text-foreground">
            {job.title}
          </p>
          <div className="flex flex-row items-center flex-wrap gap-x-2 gap-y-1">
            {job.category && (
              <p className="text-xs text-muted-foreground font-medium">
                {job.category.name}
              </p>
            )}
            <div className="size-1 rounded-full bg-muted-foreground/30 shrink-0" />
            <p className="text-xs text-muted-foreground font-medium">
              {formatJobType(job.type)}
            </p>
            <div className="size-1 rounded-full bg-muted-foreground/30 shrink-0" />
            <p className="text-xs text-muted-foreground font-medium">
              {formatLocationMode(job.locationMode)}
            </p>
            {(job.city || job.country) && (
              <>
                <div className="size-1 rounded-full bg-muted-foreground/30 shrink-0" />
                <p className="text-xs text-muted-foreground font-medium">
                  {[job.city, job.country].filter(Boolean).join(", ")}
                </p>
              </>
            )}
            <div className="size-1 rounded-full bg-muted-foreground/30 shrink-0" />
            <p className="text-xs text-muted-foreground font-medium">
              {formatDistanceToNow(job.createdAt)} ago
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <Button size={"sm"} variant={"default"} className="rounded-none">
            View
            <ArrowUpRight className="size-4" />
          </Button>
        </div>
      </Card>
    </Link>
  );
}
