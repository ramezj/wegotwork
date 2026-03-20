import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/$slug/_layout/candidates/$jobId/$candidateId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$slug/_layout/candidates/$jobId/$candidateId"!</div>
}
