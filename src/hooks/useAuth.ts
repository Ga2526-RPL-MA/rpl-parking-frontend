// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authLoginApi } from "../utils/api/authLoginApi";
import { authRegisterApi } from "../utils/api/authRegisterApi";
// import { useRouter } from "next/navigation";

export function useAuth() {
  // const router = useRouter();

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

    onSuccess: (res) => {
      console.log("Login Response:", res);

     const token = res?.data?.token;
     const user = res?.data?.user;
     
     if (token) {
        sessionStorage.setItem("token", token);
     }
      if (user) {
         sessionStorage.setItem("user", JSON.stringify(user));
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

  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      name,
      password,
      occupation,
    }: {
      email: string;
      name: string;
      password: string;
      occupation: string;
    }) => {
      return await authRegisterApi.register(email, name, password, occupation);
    },
    onSuccess: (res) => {
      console.log("Register Response:", res);
    },
    onError: (error: any) => {
      toast.error("Register gagal!", {
        description:
          error?.message || "Periksa kembali data kamu.",
      });
      console.error("Register gagal:", error);
    },
  });

  return { loginMutation, registerMutation };
}
