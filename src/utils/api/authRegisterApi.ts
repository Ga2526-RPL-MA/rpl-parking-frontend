// src/utils/api/authRegisterApi.ts
import api from "@/lib/api";

export const authRegisterApi = {
  register: async (email: string, name: string, password: string, occupation: string) => {
    const { data } = await api.post("/auth/register", {
      email,
      name,
      password,
      occupation,
    });
    return data;
  },
};
