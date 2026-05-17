import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/_layout/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/$slug/jobs",
      params: { slug: params.slug },
      replace: true,
    });
  },
  component: () => null,
});
