import { apiFetch } from "../api";

export const authLoginApi = {
  login: async (email: string, password: string) => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};
