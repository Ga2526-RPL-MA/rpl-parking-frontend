// src/utils/api/authLoginApi.ts
import api from "@/lib/api";

export const authLoginApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });
    return data;
  },
};
