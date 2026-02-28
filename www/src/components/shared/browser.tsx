import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { JobCard } from "@/components/job/job-card";
import { JobWithCategory } from "@/types/job/job";

interface BrowserProps {
  jobs: JobWithCategory[];
}

export function Browser({ jobs }: BrowserProps) {
  return (
    <Card className="rounded-lg overflow-hidden p-0 gap-0">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border p-4">
        <div className="flex gap-1.5">
          <div className="size-3 bg-secondary rounded-full" />
          <div className="size-3 bg-secondary rounded-full" />
          <div className="size-3 bg-secondary rounded-full" />
        </div>
        <div className="flex-1">
          <div className="bg-secondary py-1 text-xs text-primary font-medium text-start p-2 rounded-md">
            jobs.hirelou.app
          </div>
        </div>
      </div>

      {/* Browser content */}
      <div className="p-4 bg-background">
        <div className="flex flex-col items-center text-center space-y-4 py-8">
          <Avatar className="w-16 h-16 rounded-lg">
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
              H
            </AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight leading-none">
              Hirelou
            </h3>
            <p className="text-muted-foreground text-base text-balance font-medium leading-none">
              Explore our open positions and join our team in building the
              future.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <div key={index}>
              <JobCard job={job} slug="#" isDemo />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
