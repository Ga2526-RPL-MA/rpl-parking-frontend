import { apiFetch } from "../api";

export const authRegisterApi = {
  register: async (email: string, name: string, password: string, occupation: string) => {
    return apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, name, password, occupation }),
    });
  },
};
