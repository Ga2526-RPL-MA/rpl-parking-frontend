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
        setVehicle(data);
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

  const handleSave = async () => {
    await fetch(`/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    });
    alert("Data berhasil diperbarui!");
    router.push("/dashboard");
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
          {["plate", "owner", "email"].map((key) => (
            <div key={key}>
              <label className="block text-gray-600 mb-1 font-medium capitalize">
                {key}
              </label>
              <input
                value={vehicle[key]}
                onChange={(e) =>
                  setVehicle({ ...vehicle, [key]: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          ))}

          <div>
            <label className="block text-gray-600 mb-1 font-medium">Jenis</label>
            <select
              value={vehicle.type}
              onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option>Motor</option>
              <option>Mobil</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Hapus
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
