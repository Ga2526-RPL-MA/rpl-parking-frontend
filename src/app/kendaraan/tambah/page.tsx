"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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

import { useGetUsers } from "../hooks/useGetUsers";
import {
  CreateVehiclePayload,
  useCreateVehicle,
  usePlateNumberCheck,
} from "../hooks/useMutateVehicle";

type CreateVehicleFormValues = {
  userId: string;
  plateNumber: string;
  imageFile: File | null;
  imageUrl: string;
  type: string;
  brand: string;
  modelName: string;
  color: string;
};

export default function TambahKendaraanPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("user");

  const { register, handleSubmit, control, setValue, watch } =
    useForm<CreateVehicleFormValues>({
      defaultValues: {
        userId: "",
        plateNumber: "",
        imageFile: null,
        imageUrl: "",
        type: "",
        brand: "",
        modelName: "",
        color: "",
      },
    });

  const { mutate: checkPlate } = usePlateNumberCheck();
  const { mutate: createVehicle } = useCreateVehicle();
  const { data } = useGetUsers();

  const users = data?.data;

  const handleCheckPlateNumber = () => {
    const file = watch("imageFile");

    if (!file) {
      alert("Upload foto dulu!");
      return;
    }

    const formData = new FormData();
    formData.append("plate", file);

    checkPlate(formData, {
      onSuccess: (res) => {
        setValue("plateNumber", res.data.plateNumber);
        setValue("imageUrl", res.data.image);
      },
      onError: () => {
        alert("Gagal deteksi plat nomor");
      },
    });
  };

  // Load user role from session storage
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const role = user.role;
      setUserRole(role);
    }
  }, [users]);

  // Submit form
  const onSubmit = (form: CreateVehicleFormValues) => {
    const payload: CreateVehiclePayload = {
      plateNumber: form.plateNumber,
      image: form.imageUrl,
      type: form.type.toLowerCase() as "motor" | "mobil",
      brand: form.brand,
      modelName: form.modelName,
      color: form.color,
    };

    // ✅ Admin harus kirim userId
    if (userRole === "admin") {
      payload.userId = form.userId;
    }

    createVehicle(payload, {
      onSuccess: () => {
        alert("Kendaraan berhasil dibuat!");
        router.push(userRole === "admin" ? "/dashboard" : "/dashboard/user");
      },
      onError: () => {
        alert("Gagal membuat kendaraan");
      },
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#B6B6B6] via-[#FFFFFF] to-[#B8D3FF]">
      <div className="flex w-full flex-col justify-center px-16">
        <div className="mx-auto max-w-lg rounded-xl bg-white p-10 shadow-md">
          <h2 className="mb-1 text-2xl font-bold text-gray-800">
            Tambah Kendaraan
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            Mohon Lengkapi Data Kendaraan
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Pilih Email Pemilik (Admin only) */}
            {userRole === "admin" && (
              <div className="space-y-2">
                <Label>Pemilik Kendaraan (Email)</Label>

                <Controller
                  name="userId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih email user" />
                      </SelectTrigger>

                      <SelectContent>
                        {users?.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Upload Foto */}
            <div className="space-y-2">
              <Label>Foto Kendaraan</Label>
              <Input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={(e) =>
                  setValue("imageFile", e.target.files?.[0] || null)
                }
              />
              <p className="text-sm text-red-500">
                * Deteksi Plat Nomor untuk Otomatis Mengisi Plat Nomor
              </p>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-[150px]"
                  onClick={handleCheckPlateNumber}
                >
                  Deteksi Plat Nomor
                </Button>
              </div>
            </div>

            {/*  Plat Nomor */}
            <div className="space-y-2">
              <Label>Plat Nomor</Label>
              <Input
                placeholder="cth: L 111 ITS"
                {...register("plateNumber")}
              />
            </div>

            {/* Jenis Kendaraan */}
            <div className="space-y-2">
              <Label>Jenis Kendaraan</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motor">Motor</SelectItem>
                      <SelectItem value="Mobil">Mobil</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/*  Brand */}
            <div className="space-y-2">
              <Label>Merk Kendaraan</Label>
              <Input {...register("brand")} placeholder="cth: Suzuki" />
            </div>

            {/* Model */}
            <div className="space-y-2">
              <Label>Model Kendaraan</Label>
              <Input {...register("modelName")} placeholder="cth: XL7" />
            </div>

            {/*  Warna */}
            <div className="space-y-2">
              <Label>Warna Kendaraan</Label>
              <Input {...register("color")} placeholder="cth: Hitam" />
            </div>

            {/* Button Tambah */}
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600">
                Tambah
              </Button>
            </div>

            <div className="mt-1 text-center">
              <Button
                variant="ghost"
                onClick={() =>
                  router.push(
                    userRole === "admin" ? "/dashboard" : "/dashboard/user"
                  )
                }
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Dashboard
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
