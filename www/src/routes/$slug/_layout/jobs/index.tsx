import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/_layout/jobs/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$slug",
      params: { slug: params.slug },
      replace: true,
    });
  },
  component: () => null,
});
