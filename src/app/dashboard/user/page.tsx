"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useVehicles } from "@/hooks/useVehicles";

import NextImage from "@/components/NextImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserVehicleTable from "@/components/UserVehicleTable";

import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { data = [], isLoading, isError } = useVehicles();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Gagal memuat data kendaraan
      </div>
    );

  const filtered = data.filter((v: any) =>
    v.plateNumber.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#4A4E57] via-[#D5D5D5] to-[#F5F5F5]">
      {/* HEADER */}
      <div className="px-6 pt-4">
        <header className="flex w-full items-center justify-between rounded-2xl bg-white px-6 py-3 text-gray-600 shadow-lg">
          <div className="flex items-center gap-3">
            <NextImage
              src="/rplparkingslogo.png"
              alt="Logo RPL Parking"
              width={50}
              height={50}
              className="object-contain"
            />
            <h1 className="text-lg font-semibold">RPL Parking System</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs opacity-70">{user?.occupation}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="h-10 w-10 cursor-pointer rounded-full bg-gray-300 hover:bg-gray-400"></div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-xs text-gray-400">
                  Profile Menu
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer"
                >
                  Edit Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    document.cookie = "auth_token=; Max-Age=0; path=/";
                    logout();
                    sessionStorage.clear();
                    router.push("/auth/login");
                  }}
                  className="cursor-pointer text-red-600"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6">
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          {/* Header */}
          <div className="mb-6">
            <h2 className="mb-1 text-xl font-bold text-gray-800">
              Garasi saya
            </h2>
            <p className="text-sm text-gray-500">
              Kelola dan pantau kendaraan Anda di sini
            </p>
          </div>

          <div className="mb-5 flex gap-3">
            <input
              type="text"
              placeholder="Masukkan plat nomor kendaraan"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-full border px-4 py-2 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
            />
            <button
              onClick={() => router.push("/kendaraan/tambah")}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              + Tambah Kendaraan
            </button>
          </div>

          <UserVehicleTable data={filtered} />
        </div>
      </div>
    </div>
  );
}
