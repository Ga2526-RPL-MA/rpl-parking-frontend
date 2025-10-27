// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { authLoginApi } from "../utils/api/authLoginApi";

export function useAuth() {
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await authLoginApi.login(email, password);
    },

    onSuccess: (data) => {
      if (typeof window !== "undefined" && data?.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Login berhasil 🎉", {
        description: "Selamat datang kembali di RPL Parking System!",
      });

      // window.location.href = "/dashboard";
    },

    onError: (error: any) => {
      toast.error("Login gagal!", {
        description:
          error?.message || "Periksa kembali email dan password kamu.",
      });
      console.error("Login gagal:", error);
    },
  });

  return { loginMutation };
}
