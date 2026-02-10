import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@tanstack/react-router";
import { JobWithCategory } from "@/features/types/job/job";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

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
      <Card className="w-full group h-28 bg-input/30 hover:bg-input/50 transition-all flex flex-row border rounded-none items-center p-5 cursor-pointer shadow-none gap-0">
        {/* <div className="flex flex-col items-start text-left py-2">
          <p className="sm:text-lg text-md font-medium text-left text-foreground">
            {job.title}
          </p>
          <div className="flex flex-row items-center flex-wrap gap-x-2 gap-y-1">
            {job.category && (
              <Badge variant="outline">{job.category.name}</Badge>
            )}
            <Badge variant="outline">{formatJobType(job.type)}</Badge>
            <Badge variant="outline">
              {formatLocationMode(job.locationMode)}
            </Badge>
            {(job.city || job.country) && (
              <>
                <Badge variant="outline">
                  {[job.city, job.country].filter(Boolean).join(", ")}
                </Badge>
              </>
            )}
          </div>
        </div> */}
        {/* <div className="ml-auto">
          <Button size={"sm"} variant={"default"} className="rounded-none">
            View
            <ArrowUpRight className="size-4" />
          </Button>
        </div> */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            {/* job information */}
            <div className="flex flex-col gap-2">
              <p className="font-medium text-lg">{job.title}</p>
              <div className="flex flex-row gap-2">
                {job.category && (
                  <Badge variant="outline">{job.category.name}</Badge>
                )}
                <Badge variant="outline">{formatJobType(job.type)}</Badge>
                <Badge variant="outline">
                  {formatLocationMode(job.locationMode)}
                </Badge>
                {/* <Badge variant="outline">
                  {formatDistanceToNow(new Date(job.createdAt))}
                </Badge> */}
              </div>
            </div>

            {/* view job button */}
            <div className="hidden sm:block">
              <Button size={"sm"} variant={"ghost"}>
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
