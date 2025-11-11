// src/utils/api/api.ts
import axios from "axios";

import { getToken } from "@/lib/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
