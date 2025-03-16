import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fetcher } from "../../../utils/api";
import { FaStar } from "react-icons/fa";

export const Route = createFileRoute("/dashboard/store/allstores")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const {
    data: stores,
    isLoading,
    error,
  } = useQuery<
    { id: string; name: string; address: string; avgRating: number | null }[]
  >({
    queryKey: ["stores"],
    queryFn: () => fetcher("/stores"),
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">All Stores</h1>
      <button
        className="mb-4 text-blue-500 cursor-pointer hover:underline"
        onClick={() => navigate({ to: "/dashboard" })}
      >
        ← Back to Dashboard
      </button>
      {isLoading && <p>Loading stores...</p>}
      {error && <p className="text-red-500">Error loading stores</p>}
      {(stores?.length ?? 0 > 0) ? (
        <ul className="mt-6 space-y-4">
          {stores?.map(
            (store: {
              id: string;
              name: string;
              address: string;
              avgRating: number | null;
            }) => (
              <li
                key={store.id}
                className="p-4 border rounded-lg bg-gray-100 shadow-md"
              >
                <p className="font-bold text-lg">{store.name}</p>
                <p className="text-gray-600">{store.address}</p>

                <div className="flex items-center mt-2">
                  <span className="font-semibold">Overall Rating:</span>
                  <StarRating rating={store.avgRating} />
                </div>

                <button
                  className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                  onClick={() =>
                    navigate({ to: `/dashboard/store/${store.id}` })
                  }
                >
                  View & Rate Store
                </button>
              </li>
            )
          )}
        </ul>
      ) : (
        <p>No stores found</p>
      )}
    </div>
  );
}

function StarRating({ rating }: { readonly rating: number | null }) {
  const validRating = Number(rating) || 0;
  const fullStars = Math.floor(validRating);

  return (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index + 1}
          className={index < fullStars ? "" : "text-gray-300"}
        />
      ))}
      <span className="ml-2 text-gray-600">
        {validRating ? validRating.toFixed(1) : "No ratings yet"}
      </span>
    </div>
  );
}
