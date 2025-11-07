"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getAllVehicles } from "@/lib/api";

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
        console.log(data.data)

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
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow flex items-center justify-between px-8 py-4">
        <h1 className="font-semibold text-xl">RPL Parking System</h1>
        <div className="flex items-center gap-3">
          <p className="font-medium text-gray-700">Cindy Revalia</p>
        </div>
      </header>

      <div className="flex flex-1 p-8 gap-6">
        {/* LEFT TABLE */}
        <div className="flex-1 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Cek Data Kendaraan</h2>
            <button
              onClick={() => router.push("/kendaraan/tambah")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Tambah Kendaraan
            </button>
          </div>

          <input
            type="text"
            placeholder="Cari plat nomor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full mb-4"
          />

          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="p-3">Plat Nomor</th>
                <th className="p-3">Pemilik</th>
                <th className="p-3">Email</th>
                <th className="p-3">Jenis</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t hover:bg-blue-50">
                  <td className="p-3">{v.plateNumber}</td>
                  <td className="p-3">{v.user.name}</td>
                  <td className="p-3 text-gray-500">{v.user.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        v.type === "Mobil"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {v.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => router.push(`/dashboard/${v.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-gray-600 font-medium mb-2">Total Kendaraan</h3>
            <p className="text-3xl font-bold text-blue-600">{vehicles.length}</p>
          </div>
                    <div className="bg-white p-6 rounded-xl shadow text-center">
                <h3 className="text-gray-600 font-medium mb-2">Jumlah Motor</h3>
                <p className="text-3xl font-bold text-blue-600"> {vehicles.filter((v) => v.type === "motor").length}</p>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-gray-600 font-medium mb-2">Jumlah Mobil</h3>
            <p className="text-3xl font-bold text-blue-600">{vehicles.filter((v) => v.type === "mobil").length}</p>
                </div>
            </div>
        </div>
      </div>
  );
}
