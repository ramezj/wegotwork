import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(core)/_layout/jobs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(core)/_layout/jobs"!</div>
}
