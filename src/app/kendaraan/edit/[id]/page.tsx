"use client";

//TODO: ini form editnya masih belum ke handle bang buat update data ke backendnya karena emang strukturnya belum fix

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getVehicleById } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { vehicleDetailRoute } from "@/utils/vehicleListRoute"; // pake ini bg btw buat route detail kendaraannya, aga bingung route file nya wkkw

export default function EditKendaraanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  const userRole = currentUser?.role;

  useEffect(() => {
    async function load() {
      try {
        const data = await getVehicleById(id as string);
        setVehicle(data.data);

        const ownerId = data.data?.user?.id;
        if (!(userRole === "admin" || ownerId === currentUser.id)) {
          toast.error("Anda tidak memiliki akses untuk mengedit kendaraan ini");
          router.push(vehicleDetailRoute(String(id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, currentUser.id, userRole, router]);

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

  const handleSave = async () => {
    const payload = {
      plateNumber: vehicle.plateNumber,
      type: vehicle.type,
      brand: vehicle.brand,
      modelName: vehicle.modelName,
      color: vehicle.color,
    };

    await fetch(`/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    toast.success("Data kendaraan berhasil diperbarui");
    router.push(vehicleDetailRoute(String(id)));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#B6B6B6] via-[#FFFFFF] to-[#B8D3FF] px-4">
      <div className="w-full max-w-lg space-y-6 rounded-xl border bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          Edit Kendaraan
        </h1>

        {/* Plat Nomor */}
        <div className="space-y-2">
          <Label>Plat Nomor</Label>
          <Input
            value={vehicle.plateNumber}
            onChange={(e) =>
              setVehicle({ ...vehicle, plateNumber: e.target.value })
            }
          />
        </div>

        {/* Jenis */}
        <div className="space-y-2">
          <Label>Jenis Kendaraan</Label>
          <Select
            value={vehicle.type}
            onValueChange={(val) => setVehicle({ ...vehicle, type: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Motor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Motor">Motor</SelectItem>
              <SelectItem value="Mobil">Mobil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label>Brand Kendaraan</Label>
          <Input
            value={vehicle.brand || ""}
            onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
          />
        </div>

        {/* Model */}
        <div className="space-y-2">
          <Label>Model Kendaraan</Label>
          <Input
            value={vehicle.modelName || ""}
            onChange={(e) =>
              setVehicle({ ...vehicle, modelName: e.target.value })
            }
          />
        </div>

        {/* Warna */}
        <div className="space-y-2">
          <Label>Warna Kendaraan</Label>
          <Input
            value={vehicle.color || ""}
            onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
          />
        </div>

        {/* Foto Kendaraan */}
        <div className="space-y-2">
          <Label>Foto Kendaraan</Label>
          <Input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setVehicle({ ...vehicle, photoFile: file });
              }
            }}
          />
          <p className="text-xs text-gray-500">
            Format yang didukung: PNG, JPG, JPEG
          </p>
        </div>

        {/* Aksi */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => router.push(vehicleDetailRoute(String(id)))}
          >
            Batal
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
