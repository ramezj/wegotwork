import { Card } from "../ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { JobWithCategory } from "@/features/types/job/job";
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
      <Card className="w-full group min-h-28 bg-input/30 hover:bg-input/50 transition-all flex flex-row border rounded-none items-center p-5 cursor-pointer shadow-none gap-0">
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            {/* job information */}
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <p className="font-medium text-lg truncate-options">
                {job.title}
              </p>
              <div className="flex flex-row flex-wrap gap-2">
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
            <div className="sm:block hidden shrink-0">
              <div className="px-2">
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
