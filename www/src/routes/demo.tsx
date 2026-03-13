import { createFileRoute } from "@tanstack/react-router";
import { Browser } from "@/components/shared/browser";
import { JobWithCategory } from "@/types/job/job";
import { DemoWallpaper } from "@/components/shared/demo-wallpaper";
import Header from "@/components/shared/header";

export const Route = createFileRoute("/demo")({
  component: DemoPage,
});

function DemoWallpaperSection({ jobs }: { jobs: JobWithCategory[] }) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <DemoWallpaper />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          <Browser jobs={jobs} />
        </div>
      </div>
    </section>
  );
}

function DemoHeroSection() {
  return (
    <section className="bg-background px-4 py-20 text-foreground">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Smart hiring, simple demos
        </p>
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          Show candidates exactly what your hiring experience feels like.
        </h2>
        <p className="max-w-2xl text-balance text-base font-medium text-muted-foreground sm:text-lg">
          Use this demo page to experiment with layouts, copy, and visuals
          before you ship your next iteration of the landing page.
        </p>
      </div>
    </section>
  );
}

function DemoPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <Header session={null} />
      <DemoWallpaperSection jobs={demoJobs} />
      <DemoHeroSection />
    </div>
  );
}

const demoJobs: JobWithCategory[] = [
  {
    id: "#",
    title: "Senior Software Engineer",
    type: "FULLTIME",
    status: "PUBLISHED",
    locationMode: "HYBRID",
    address: "123 Tech Street",
    country: "United States",
    city: "San Francisco",
    description:
      "We are looking for an experienced software engineer to join our team.",
    salaryMin: 120000,
    salaryMax: 180000,
    currency: "USD",
    salaryInterval: "YEARLY",
    experienceLevel: "SENIOR",
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: "#",
    categoryId: "#",
    pipelineId: "#",
    category: {
      id: "#",
      name: "Engineering",
      createdAt: new Date(),
      organizationId: "#",
    },
    questions: [],
  },
  {
    id: "#",
    title: "Product Designer",
    type: "FULLTIME",
    status: "PUBLISHED",
    locationMode: "REMOTE",
    address: null,
    country: "United States",
    city: "Remote",
    description: "Looking for a product designer with a strong portfolio.",
    salaryMin: 100000,
    salaryMax: 150000,
    currency: "USD",
    salaryInterval: "YEARLY",
    experienceLevel: "MID",
    createdAt: new Date(),
    updatedAt: new Date(),
    organizationId: "#",
    categoryId: "#",
    pipelineId: "#",
    category: {
      id: "#",
      name: "Design",
      createdAt: new Date(),
      organizationId: "#",
    },
    questions: [],
  },
];
