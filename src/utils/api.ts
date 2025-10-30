// src/utils/api/index.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      errorData = {};
    }

    const error = new Error(
      errorData?.message || `Request failed with status ${response.status}`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;

    error.status = response.status;
    error.data = errorData;

    throw error;
  }

  return response.json();
}
