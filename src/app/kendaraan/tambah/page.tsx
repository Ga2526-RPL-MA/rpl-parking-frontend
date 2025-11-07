"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createVehicle, getVehicleByPlate } from "@/lib/api";

export default function TambahKendaraanPage() {
  const [form, setForm] = useState({
    owner: "",
    plate: "",
    email: "",
    type: "Mobil",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createVehicle(form);
      alert("Kendaraan berhasil ditambahkan!");
      router.push("/dashboard");
    } catch (err) {
      alert("Gagal menambahkan kendaraan!");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOCR = async () => {
    const res = await getVehicleByPlate(form.plate);
    console.log("Hasil OCR:", res);
  };

  return (
    <div className="flex h-screen bg-linear-to-b from-gray-50 to-blue-50">
      <div className="flex flex-col justify-center w-full px-16">
        <div className="bg-white rounded-xl shadow-md p-10 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-1 text-gray-800">Tambah Kendaraan</h2>
          <p className="text-sm text-gray-500 mb-6">
            Lengkapi data kendaraan sesuai identitas yang terdaftar pada sistem kampus
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            />

            <input
              type="text"
              placeholder="Plat Nomor"
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            />

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full"
            >
              <option>Mobil</option>
              <option>Motor</option>
            </select>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCheckOCR}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cek dari OCR
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {loading ? "Menyimpan..." : "Daftar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
