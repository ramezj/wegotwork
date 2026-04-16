import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { JobCardForLandingPage } from "@/components/job/job-card";
import { JobWithCategory } from "@/types/job/job";

interface BrowserProps {
  jobs: JobWithCategory[];
}

export function Browser({ jobs }: BrowserProps) {
  return (
    <Card className="rounded-md overflow-hidden p-0 gap-0 bg-secondary">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 p-4">
        <div className="flex gap-1.5">
          <div className="size-3 bg-red-400 rounded-full" />
          <div className="size-3 bg-yellow-400 rounded-full" />
          <div className="size-3 bg-green-400 rounded-full" />
        </div>
        <div className="flex-1">
          <div className="bg-background border border-input py-1 text-xs text-primary font-normal text-start p-2 rounded-md">
            careers.lunics.co/demo
          </div>
        </div>
      </div>

      {/* Browser content */}
      <div className="p-4">
        <div className="flex flex-col items-center text-center space-y-4 py-6 -mt-4">
          <Avatar className="w-16 h-16 bg-primary">
            <AvatarFallback className="text-2xl bg-primary font-normal text-primary-foreground">
              L
            </AvatarFallback>
          </Avatar>
          <div className="space-y-4">
            <h3 className="text-3xl md:text-4xl font-normal tracking-tighter leading-none text-primary">
              Lunics
            </h3>
            <p className="text-muted-foreground text-base text-balance font-normal leading-none ">
              Explore our open positions and join our team in building the
              future.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <div key={index}>
              <JobCardForLandingPage job={job} slug="#" isDemo />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
