import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Job } from "generated/prisma/client";

export function JobCard({ job }: { job: Job }) {
  return (
    <div>
      <div className="w-full flex border border-foreground/20 border-dashed hover:border-white/30 bg-theme rounded-none items-center duration-200 pt-3 pb-3 cursor-pointer">
        <div className="mx-5 my-3 flex flex-col items-start text-left">
          <p className="sm:text-lg text-md font-bold text-left text-foreground">
            {job.title}
          </p>
          <div className="mt-1 flex">
            <p className="text-xs text-white font-medium">
              {formatDistanceToNow(job.createdAt)} ago
            </p>
          </div>
        </div>
        <div className="mr-5 ml-auto">
          <Button size={"sm"} variant={"default"} className="rounded-none">
            <Settings className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
