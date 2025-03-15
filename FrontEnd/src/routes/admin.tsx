import { createFileRoute, Outlet } from "@tanstack/react-router";
import Protected from "../components/Protected";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Protected role="admin">
      <Outlet />
    </Protected>
  );
}
