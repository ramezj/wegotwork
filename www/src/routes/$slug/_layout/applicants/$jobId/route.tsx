import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$slug/_layout/applicants/$jobId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$slug/_layout/applicants/$jobId"!</div>
}
