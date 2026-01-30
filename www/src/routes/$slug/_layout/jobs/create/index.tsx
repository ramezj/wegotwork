import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$slug/_layout/jobs/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$slug/_layout/jobs/create/"!</div>
}
