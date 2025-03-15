const API_BASE_URL = "http://localhost:3000";

export async function fetcher<T>(
  url: string,
  options: RequestInit = {},
  logout?: () => void
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...options.headers,
    },
  });

  if (response.status === 401 && logout) {
    console.warn("Unauthorized request. Logging out...");
    logout();
    throw new Error("Unauthorized - Please login again.");
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
