import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$slug/_layout/applicants")({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: "Applicants", content: "Applicants" },
      { name: "Applicants" },
    ],
  }),
});

function RouteComponent() {
  return <div>Hello "/$slug/_layout/applicants"!</div>;
}
