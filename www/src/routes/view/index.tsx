import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/view/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/view/"!</div>
}
