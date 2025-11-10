// src/lib/api.ts
import axios from "axios";
import { GetServerSidePropsContext } from "next/types";
import Cookies from "universal-cookie";

import { getToken } from "@/lib/cookies";

import baseURL from "./url";


// -----------------------------------
// 1️⃣ Server-side context
// -----------------------------------
let context: GetServerSidePropsContext | null = null;

export function setApiContext(ctx: GetServerSidePropsContext) {
  context = ctx;
}

// -----------------------------------
// 2️⃣ Axios Instance
// -----------------------------------
export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // tetap false kalau pakai Bearer token
});

// -----------------------------------
// 3️⃣ Request Interceptor
// -----------------------------------
api.interceptors.request.use((config) => {
  if (!config.headers) return config;

  let token: string | undefined;
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    // browser: ambil token dari cookie/localStorage
    token = getToken();
  } else if (context) {
    // server-side: ambil token dari cookie request
    const cookies = new Cookies(context.req?.headers.cookie);
    token = cookies.get("auth_token"); // <-- ganti sesuai nama cookie login
  }

  console.log("[API] Token used:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// -----------------------------------
// 4️⃣ Response Interceptor
// -----------------------------------
api.interceptors.request.use((config) => {
  if (!config.headers) return config;

  let token: string | undefined;
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    // ✅ Ambil dari cookie dulu
    token = getToken();

    // ✅ Kalau cookie tidak ada → fallback ke localStorage
    if (!token) {
      token = localStorage.getItem("auth_token") || undefined;
      console.log("[API] Fallback token (localStorage):", token);
    }

  } else if (context) {
    const cookies = new Cookies(context.req?.headers.cookie);
    token = cookies.get("auth_token");
  }

  console.log("[API] Token used:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// -----------------------------------
// 5️⃣ API Methods
// -----------------------------------
export async function getAllVehicles() {
  const { data } = await api.get("/vehicles");
  return data;
}

export async function getVehicleById(id: string) {
  const { data } = await api.get(`/vehicles/${id}`);
  return data;
}

export async function createVehicle(payload: {
  owner: string;
  plate: string;
  email: string;
  type: string;
}) {
  const { data } = await api.post("/vehicles", payload);
  return data;
}

export async function updateVehicle(
  id: string,
  payload: { owner?: string; plate?: string; email?: string; type?: string }
) {
  const { data } = await api.put(`/vehicles/${id}`, payload);
  return data;
}

export async function deleteVehicle(id: string) {
  const { data } = await api.delete(`/vehicles/${id}`);
  return data;
}

export async function getVehicleByPlate(plate: string) {
  const { data } = await api.get(
    `/vehicles/plate?plate=${encodeURIComponent(plate)}`
  );
  return data;
}

export const getOwnVehicles = async () => {
  const { data } = await api.get("/vehicles/own");
  return data;
};

export default api;
