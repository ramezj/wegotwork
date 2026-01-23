import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Job } from "generated/prisma/client";

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="w-full flex flex-row border rounded-none items-center p-5 cursor-pointer shadow-none gap-0">
      <div className="flex flex-col items-start text-left py-2">
        <p className="sm:text-lg text-md font-bold text-left text-foreground">
          {job.title}
        </p>
        <div className="flex">
          <p className="text-xs text-white font-medium">
            {formatDistanceToNow(job.createdAt)} ago
          </p>
        </div>
      </div>
      <div className="ml-auto">
        <Button size={"sm"} variant={"default"} className="rounded-none">
          <Settings className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
