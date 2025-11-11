"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAllVehicles } from "@/lib/api";

import LoadingAnimation from "@/components/Loading";
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

import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

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

  if (loading) return <LoadingAnimation />;

  //right sidebar calculations progress bars
  const totalMotor = vehicles.filter(
    (v) => v.type.toLowerCase() === "motor"
  ).length;
  const totalMobil = vehicles.filter(
    (v) => v.type.toLowerCase() === "mobil"
  ).length;

  const maxMotor = 250;
  const maxMobil = 20;

  const motorProgress = Math.min((totalMotor / maxMotor) * 100, 100);
  const mobilProgress = Math.min((totalMobil / maxMobil) * 100, 100);

  const totalMax = maxMotor + maxMobil;
  const totalProgress = Math.min(
    ((totalMotor + totalMobil) / totalMax) * 100,
    100
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
            <h1 className="hidden text-lg font-semibold sm:block">
              RPL Parking System
            </h1>
          </div>

          {/* RIGHT PROFILE AREA */}
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs opacity-70">{user?.role}</p>
            </div>

            {/* ✅ Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="h-10 w-10 cursor-pointer rounded-full bg-gray-300 hover:bg-gray-400"></div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-xs text-gray-400">
                  Profile Menu
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* TODO: Integrate Profile Endpoint */}
                {/* <DropdownMenuItem
                  onClick={() => router.push("/profile")}
                  className="cursor-pointer"
                >
                  Edit Profile
                </DropdownMenuItem> */}

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
      <div className="flex-1 px-6 py-4">
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {/* SIDEBAR SUMMARY */}
          <div className="order-1 col-span-1 flex flex-col gap-4 md:order-2">
            {/* Total Kendaraan */}
            <div className="rounded-2xl bg-white p-5 text-center shadow">
              <h3 className="mb-2 font-medium text-gray-600">
                Parking Overview
              </h3>
              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-blue-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">Total Kendaraan / 270</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalMotor + totalMobil}
              </p>
            </div>

            {/* Motor */}
            <div className="rounded-2xl bg-white p-5 text-center shadow">
              <h3 className="mb-2 font-medium text-gray-600">Motor</h3>
              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-blue-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${motorProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">Total Motor / 250</p>
              <p className="text-3xl font-bold text-blue-600">{totalMotor}</p>
            </div>

            {/* Mobil */}
            <div className="rounded-2xl bg-white p-5 text-center shadow">
              <h3 className="mb-2 font-medium text-gray-600">Mobil</h3>
              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-blue-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all"
                  style={{ width: `${mobilProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">Total Mobil / 20</p>
              <p className="text-3xl font-bold text-blue-600">{totalMobil}</p>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="order-2 col-span-1 rounded-2xl bg-white p-6 shadow md:order-1 md:col-span-2">
            <h2 className="mb-1 text-xl font-semibold">Cek Data Kendaraan</h2>
            <p className="mb-4 text-sm text-gray-500">
              Masukkan plat nomor untuk melihat detail kendaraan
            </p>

            <div className="mb-5 flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                placeholder="Cari berdasarkan plat nomor"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 rounded-full border px-4 py-2 transition focus:border-blue-500 focus:ring-1 focus:ring-blue-400"
              />
              <button
                onClick={() => router.push("/kendaraan/tambah")}
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-blue-700"
              >
                + Tambah Kendaraan
              </button>
            </div>

            <VehicleTable data={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
}
