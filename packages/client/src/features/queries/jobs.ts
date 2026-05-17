import { getJobsBySlugFn } from "@/features/services/jobs/get-by-slug";
import { queryOptions } from "@tanstack/react-query";
import { getJobByIdFn } from "@/features/services/jobs/get-job";
import { viewJobFn } from "@/features/services/jobs/view-job";

export const jobsBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["jobs", slug],
    queryFn: () => getJobsBySlugFn({ data: { slug } }),
    staleTime: 60 * 60 * 1000,
  });

export const jobByIdQueryOptions = (jobId: string) =>
  queryOptions({
    queryKey: ["job", jobId],
    queryFn: () => getJobByIdFn({ data: { jobId } }),
    staleTime: 60 * 60 * 1000,
  });

export const viewJobQueryOptions = (jobId: string) =>
  queryOptions({
    queryKey: ["view-job", jobId],
    queryFn: () => viewJobFn({ data: { jobId } }),
    staleTime: 60 * 60 * 1000,
  });
