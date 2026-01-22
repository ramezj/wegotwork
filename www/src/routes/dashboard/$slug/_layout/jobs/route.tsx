import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$slug/_layout/jobs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/$slug/_layout/jobs"!</div>
}
