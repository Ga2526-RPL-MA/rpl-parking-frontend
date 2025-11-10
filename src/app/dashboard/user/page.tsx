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

export default function DashboardPage() {
  const { data = [], isLoading, isError } = useVehicles();
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center text-gray-500">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="h-screen flex justify-center items-center text-red-500">
        Gagal memuat data kendaraan
      </div>
    );

const filtered = data.filter((v: any) =>
  v.plateNumber.toLowerCase().includes(query.toLowerCase())
);


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#4A4E57] via-[#D5D5D5] to-[#F5F5F5]">
      {/* HEADER */}
      <div className="px-6 pt-4">
        <header className="w-full bg-white text-gray-600 rounded-2xl shadow-lg flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <NextImage
              src="/rplparkingslogo.png"
              alt="Logo RPL Parking"
              width={50}
              height={50}
              className="object-contain"
            />
            <h1 className="font-semibold text-lg">RPL Parking System</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight hidden sm:block">
              <p className="font-medium text-sm">Made Satya</p>
              <p className="text-xs opacity-70">Mahasiswa</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 cursor-pointer"></div>
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
                    sessionStorage.clear();
                    router.push("/auth/login");
                  }}
                  className="text-red-600 cursor-pointer"
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
  <div className="bg-white rounded-2xl shadow-lg p-6">
    {/* Header */}
    <div className="mb-6">
      <h2 className="font-bold text-xl text-gray-800 mb-1">Garasi saya</h2>
      <p className="text-gray-500 text-sm">
        Kelola dan pantau kendaraan Anda di sini
      </p>
        </div>

          <div className="flex gap-3 mb-5">
            <input
              type="text"
              placeholder="Masukkan plat nomor kendaraan"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full border focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition"
            />
            <button
              onClick={() => router.push("/kendaraan/tambah")}
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
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
