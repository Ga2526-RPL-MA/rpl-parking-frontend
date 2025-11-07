"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getVehicleById } from "@/lib/api";

export default function DetailKendaraanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getVehicleById(id as string);
        setVehicle(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  if (!vehicle)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Data tidak ditemukan
      </div>
    );

  const handleDelete = async () => {
    if (confirm("Yakin hapus kendaraan ini?")) {
      await fetch(`/vehicles/${id}`, { method: "DELETE" });
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow px-8 py-4 flex justify-between">
        <h1 className="font-semibold text-xl">Detail Kendaraan</h1>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">
          ← Kembali
        </button>
      </header>

      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow p-8 w-[500px] space-y-4">
          {/* Plat Nomor */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Plat Nomor</label>
            <p className="text-gray-800">{vehicle.plateNumber}</p>
          </div>

          {/* Pemilik */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Pemilik</label>
            <p className="text-gray-800">{vehicle.user?.name}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Email</label>
            <p className="text-gray-800">{vehicle.user?.email}</p>
          </div>

          {/* Jenis Kendaraan */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Jenis</label>
      <p className="px-2 py-1 rounded-full text-sm inline-block" >{vehicle.type}
            </p> 
          </div>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Hapus
            </button>
            <button
              onClick={() => router.push(`/kendaraan/edit/${id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
