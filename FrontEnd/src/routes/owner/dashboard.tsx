import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/owner/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/owner/dashboard"!</div>
}
