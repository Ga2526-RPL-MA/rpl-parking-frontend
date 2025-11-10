import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { setToken } from "@/lib/cookies";

import { authLoginApi } from "../utils/api/authLoginApi";
import { authRegisterApi } from "../utils/api/authRegisterApi";

export function useAuth() {
  const router = useRouter();

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
  const user = res?.data;
  const token = res?.data?.token;

  console.log("USER ROLE:", user?.role);

  if (token) {
    setToken(token); 
    localStorage.setItem("token", token); // FIX PENTING
  }

  if (user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  toast.success("Login berhasil", {
    description: "Selamat datang kembali di RPL Parking System!",
  });

  const role = user?.role?.toLowerCase();
  if (role === "admin") {
    router.push("/dashboard");
  } else if (role === "user") {
    router.push("/dashboard/user");
  } else {
    router.push("/");
  }
},



    onError: () => {
      toast.error("Login gagal!", {
        description: "Periksa kembali email dan password kamu.",
      });
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
    onSuccess: () => {
      toast.success("Register Berhasil");
      router.push("/auth/login")
    },
    onError: (error: AxiosError) => {
      let message = "";
      if (error.status === 400) {
        message = "Email Sudah Digunakan";
      }
      toast.error("Register Gagal!", {
        description: message,
      });
    },
  });

  return { loginMutation, registerMutation };
}
