"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";

export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles-own"],
    queryFn: async () => {
      try {
        const res = await api.get("/vehicles/own");

        // ✅ Return langsung array kendaraan
        return Array.isArray(res.data?.data) ? res.data.data : [];
      } catch (err: any) {
        if (err.response?.status === 404) {
          return []; // Tidak ada kendaraan = tetep berhasil
        }
        throw err; // Kalau error beneran, lempar lagi
      }
    },
  });
}
