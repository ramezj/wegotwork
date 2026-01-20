import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$slug/_layout/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$slug/dashboard"!</div>
}
