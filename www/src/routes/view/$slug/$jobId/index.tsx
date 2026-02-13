import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/view/$slug/$jobId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/view/$slug/$jobId/"!</div>
}
