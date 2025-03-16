import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useParams,
  useNavigate,
} from "@tanstack/react-router";
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
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["user", userid],
    queryFn: () => fetcher<User>(`/admin/users/${userid}`),
  });

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      <button
        onClick={() => navigate({ to: "/admin/dashboard" })}
        className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Back
      </button>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          {user ? (
            <>
              <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
              <div className="mb-2">
                <strong className="block text-gray-700">Email:</strong>
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="mb-2">
                <strong className="block text-gray-700">Address:</strong>
                <span className="text-gray-900">{user.address}</span>
              </div>
              <div className="mb-2">
                <strong className="block text-gray-700">Role:</strong>
                <span className="text-gray-900">{user.role}</span>
              </div>
              {user.role === "store_owner" && (
                <div className="mb-2">
                  <strong className="block text-gray-700">Average Rating:</strong>
                  <span className="text-gray-900">
                    {user.rating ?? "No ratings yet"}
                  </span>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">No user data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
