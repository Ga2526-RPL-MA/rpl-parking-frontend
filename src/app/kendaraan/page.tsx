"use client";

// NOTE : ini kan file dari kodingan desain yang lama ya, kayanya ga kepake lagi, bebas mau di hapus ato di refactor bg

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
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  if (!vehicle)
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
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
    <div className="flex h-screen flex-col bg-gray-50">
      <header className="flex justify-between bg-white px-8 py-4 shadow">
        <h1 className="text-xl font-semibold">Detail Kendaraan</h1>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          ← Kembali
        </button>
      </header>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-[500px] space-y-4 rounded-xl bg-white p-8 shadow">
          {["plate", "owner", "email"].map((key) => (
            <div key={key}>
              <label className="mb-1 block font-medium text-gray-600 capitalize">
                {key}
              </label>
              <input
                value={vehicle[key]}
                onChange={(e) =>
                  setVehicle({ ...vehicle, [key]: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>
          ))}

          <div>
            <label className="mb-1 block font-medium text-gray-600">
              Jenis
            </label>
            <select
              value={vehicle.type}
              onChange={(e) => setVehicle({ ...vehicle, type: e.target.value })}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option>Motor</option>
              <option>Mobil</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Hapus
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
