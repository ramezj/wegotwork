import { Card } from "../ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { JobWithCategory } from "@/types/job/job";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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
      <Card className="w-full group min-h-28 bg-card transition-all flex flex-row border items-center p-5 cursor-pointer gap-0">
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            {/* job information */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <p className="font-semibold text-lg truncate-options">
                {job.title}
              </p>
              <div className="flex flex-row flex-wrap gap-2">
                {job.category && (
                  <Badge variant="secondary">{job.category.name}</Badge>
                )}
                <Badge variant="secondary">{formatJobType(job.type)}</Badge>
                <Badge variant="secondary">
                  {formatLocationMode(job.locationMode)}
                </Badge>
                {/* <Badge variant="outline">
                  {formatDistanceToNow(new Date(job.createdAt))}
                </Badge> */}
              </div>
            </div>

            {/* view job button */}
            <div className="sm:block hidden shrink-0">
              <div className="px-2">
                <Button>View Job</Button>
              </div>
            </div>
            <div className="sm:hidden block shrink-0">
              <div className="px-2">
                <ArrowRight className="h-5 w-5 text-foreground group-hover:text-primary shrink-0 duration-100 group-hover:-rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function JobCardForViewPage({
  job,
  slug,
}: {
  job: JobWithCategory;
  slug: string;
}) {
  return (
    <Link
      viewTransition
      to={"/view/$slug/$jobId"}
      params={{ slug, jobId: job.id }}
      preload="render"
    >
      <Card className="w-full group min-h-28 bg-card hover:bg-muted/50 transition-all flex flex-row border border-input items-center p-5 cursor-pointer gap-0">
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            {/* job information */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <p className="font-semibold text-lg truncate-options">
                {job.title}
              </p>
              <div className="flex flex-row flex-wrap gap-2">
                {job.category && (
                  <Badge variant="secondary">{job.category.name}</Badge>
                )}
                <Badge variant="secondary">{formatJobType(job.type)}</Badge>
                <Badge variant="secondary">
                  {formatLocationMode(job.locationMode)}
                </Badge>
                {/* <Badge variant="outline">
                  {formatDistanceToNow(new Date(job.createdAt))}
                </Badge> */}
              </div>
            </div>

            {/* view job button */}
            <div className="sm:block hidden shrink-0">
              <div className="px-2">
                <Button className="">View Job</Button>
              </div>
            </div>
            <div className="sm:hidden block shrink-0">
              <div className="px-2">
                <ArrowRight className="h-5 w-5 text-foreground group-hover:text-primary shrink-0 duration-100 group-hover:-rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
