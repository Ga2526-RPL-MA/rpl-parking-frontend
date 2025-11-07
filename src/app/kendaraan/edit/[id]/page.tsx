"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getVehicleById } from "@/lib/api";

export default function EditKendaraanPage() {
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

  const handleSave = async () => {
    await fetch(`/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    });
    alert("Data berhasil diperbarui!");
    router.push(`/dashboard/${id}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow px-8 py-4 flex justify-between">
        <h1 className="font-semibold text-xl">Edit Kendaraan</h1>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline">
          ← Kembali
        </button>
      </header>

      <div className="flex-1 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow p-8 w-[500px] space-y-4">
          {/* Plat Nomor */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Plat Nomor</label>
            <input
              value={vehicle.plateNumber}
              placeholder={vehicle.plateNumber}
              onChange={(e) =>
                setVehicle({ ...vehicle, plateNumber: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Pemilik */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Pemilik</label>
            <input
              value={vehicle.user?.name || ""}
              placeholder={vehicle.user?.name || ""}
              onChange={(e) =>
                setVehicle({ ...vehicle, user: { ...vehicle.user, name: e.target.value } })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Email</label>
            <input
              value={vehicle.user?.email || ""}
              placeholder={vehicle.user?.email || ""}
              onChange={(e) =>
                setVehicle({ ...vehicle, user: { ...vehicle.user, email: e.target.value } })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Jenis Kendaraan */}
          <div>
            <label className="block text-gray-600 mb-1 font-medium">Jenis</label>
            <select
              value={vehicle.type}
              onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Motor">Motor</option>
              <option value="Mobil">Mobil</option>
            </select>
          </div>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => router.push(`/kendaraan/${id}`)}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
