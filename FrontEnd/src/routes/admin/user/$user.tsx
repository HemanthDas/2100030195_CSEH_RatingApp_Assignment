import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/user/$user')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/user/$user"!</div>
}
