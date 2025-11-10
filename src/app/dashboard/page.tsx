"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAllVehicles } from "@/lib/api";

import NextImage from "@/components/NextImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import VehicleTable from "@/components/VehicleTable";


export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllVehicles();
        setVehicles(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = vehicles.filter((v) =>
    v.plateNumber.toLowerCase().includes(query.toLowerCase())
  );

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center text-gray-500">
        Loading...
      </div>
    );

  //right sidebar calculations progress bars
  const totalMotor = vehicles.filter((v) => v.type.toLowerCase() === "motor").length;
  const totalMobil = vehicles.filter((v) => v.type.toLowerCase() === "mobil").length;

  const maxMotor = 250;
  const maxMobil = 20;

  const motorProgress = Math.min((totalMotor / maxMotor) * 100, 100);
  const mobilProgress = Math.min((totalMobil / maxMobil) * 100, 100);

  const totalMax = maxMotor + maxMobil;
  const totalProgress = Math.min(((totalMotor + totalMobil) / totalMax) * 100, 100);
    

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

        {/* RIGHT PROFILE AREA */}
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight hidden sm:block">
            <p className="font-medium text-sm">Cindy Revalia</p>
            <p className="text-xs opacity-70">Tendik</p>
          </div>

          {/* ✅ Dropdown Menu */}
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
    <div className="flex-1 px-6 py-4">
      <div className="w-full grid grid-cols-3 gap-6">
        
        {/* TABLE SECTION */}
        <div className="col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold text-xl mb-1">Cek Data Kendaraan</h2>
          <p className="text-gray-500 text-sm mb-4">
            Masukkan plat nomor untuk melihat detail kendaraan
          </p>

          <div className="flex gap-3 mb-5">
            <input
              type="text"
              placeholder="Masukkan plat nomor"
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

          {/* Table Component */} 
          <VehicleTable data={filtered} /> 
        </div>

        {/* RIGHT SIDEBAR SUMMARY*/}
        <div className="flex flex-col gap-4">
          {/* Total Kendaraan */}
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <h3 className="text-gray-600 font-medium mb-2">Parking Overview</h3>
            <div className="h-2 bg-blue-200 w-full rounded-full mb-3 overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm">Total Kendaraan / 270</p>
            <p className="text-3xl font-bold text-blue-600">{totalMotor + totalMobil}</p>
          </div>

          {/* Motor */}
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <h3 className="text-gray-600 font-medium mb-2">Motor</h3>
            <div className="h-2 bg-blue-200 w-full rounded-full mb-3 overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all"
                style={{ width: `${motorProgress}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm">Total Motor / 250</p>
            <p className="text-3xl font-bold text-blue-600">{totalMotor}</p>
          </div>

          {/* Mobil */}
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <h3 className="text-gray-600 font-medium mb-2">Mobil</h3>
            <div className="h-2 bg-blue-200 w-full rounded-full mb-3 overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all"
                style={{ width: `${mobilProgress}%` }}
              />
            </div>
            <p className="text-gray-500 text-sm">Total Mobil / 20</p>
            <p className="text-3xl font-bold text-blue-600">{totalMobil}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
