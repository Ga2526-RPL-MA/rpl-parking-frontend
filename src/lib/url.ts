// Utility to normalize API base URL and safely join paths
export const rawBase = process.env.NEXT_PUBLIC_API_URL ?? "";

export const baseURL = rawBase.replace(/\/+$/, "");

export function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export default baseURL;
