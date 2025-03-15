import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { fetcher } from "../../../utils/api";

export const Route = createFileRoute("/admin/user/$userid")({
  component: RouteComponent,
});
interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  role: "admin" | "user" | "store_owner";
  rating?: number;
}
function RouteComponent() {
  const { userid } = useParams({ strict: false });

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["user", userid],
    queryFn: () => fetcher<User>(`/admin/users/${userid}`),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      {user ? (
        <>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          {user.role === "store_owner" && (
            <p>
              <strong>Average Rating:</strong> {user.rating ?? "No ratings yet"}
            </p>
          )}
        </>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}
