"use client";

import { ArrowLeft, Bike, Briefcase, Car, Mail, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getVehicleById } from "@/lib/api";

import LoadingAnimation from "@/components/Loading";
import NextImage from "@/components/NextImage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useDeleteVehicle,
  useUpdateVehicle,
} from "@/app/kendaraan/hooks/useMutateVehicle";

interface DetailItemProps {
  label: string;
  value: string;
  field?: string;
  icon?: React.ReactNode;
  isEditing?: boolean;
  onChange?: (field: string, value: string) => void;
}

const DetailItem = ({
  label,
  value,
  field,
  icon,
  isEditing = false,
  onChange,
}: DetailItemProps) => (
  <div className="flex flex-col">
    <label className="mb-1 text-xs text-gray-500">{label}</label>

    <div className="flex items-center justify-between border-b border-gray-200 pb-1">
      <div className="flex w-full items-center">
        {icon}

        {!isEditing ? (
          <p className="text-base text-gray-800">{value}</p>
        ) : (
          <input
            className="w-full rounded border px-2 py-1 text-sm"
            value={value}
            onChange={(e) => onChange?.(field!, e.target.value)}
          />
        )}
      </div>
    </div>
  </div>
);

export default function DetailKendaraanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("user");

  const { mutate: deleteVehicle, isPending: isDeleting } = useDeleteVehicle();
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    plateNumber: "",
    brand: "",
    modelName: "",
    color: "",
    type: "",
  });

  // Load kendaraan
  useEffect(() => {
    async function load() {
      try {
        const data = await getVehicleById(id as string);
        setVehicle(data.data);

        const userData = sessionStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserRole(user.role?.toLowerCase() || "user");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Set form data ketika data datang
  useEffect(() => {
    if (vehicle) {
      setFormData({
        plateNumber: vehicle.plateNumber,
        brand: vehicle.brand,
        modelName: vehicle.modelName,
        color: vehicle.color,
        type: vehicle.type,
      });
    }
  }, [vehicle]);

  const getDashboardPath = () =>
    userRole === "admin" ? "/dashboard" : "/dashboard/user";

  const handleDelete = (id: string) => {
    if (confirm("Yakin hapus kendaraan ini?")) {
      deleteVehicle(id);
    }
  };

  const handleSave = () => {
    updateVehicle({
      id: vehicle.id,
      payload: { ...formData, type: formData.type as "mobil" | "motor" },
    });
    setIsEditing(false);
  };

  if (loading) return <LoadingAnimation />;

  if (!vehicle)
    return (
      <div className="flex h-screen items-center justify-center">
        Data tidak ditemukan
      </div>
    );

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Gambar */}
      <div className="flex h-full w-full items-center justify-center bg-black/5 lg:w-1/2">
        <div className="w-full max-w-[500px] overflow-hidden rounded-xl border bg-white shadow-lg">
          <NextImage
            src={vehicle.image}
            alt="Kendaraan"
            serverStaticImg
            className="w-full object-cover"
            width={690}
            height={600}
          />
        </div>
      </div>

      {/* Detail */}
      <div className="flex w-full items-center justify-center bg-gradient-to-b from-[#B6B6B6] via-[#FFFFFF] to-[#B8D3FF] p-4 sm:p-8 lg:w-2/3">
        <Card className="w-full max-w-lg border-none p-6 shadow-xl">
          <CardHeader className="pb-8 text-center">
            <CardTitle className="text-3xl font-semibold">
              Detail Kendaraan
            </CardTitle>
            <CardDescription>Lihat atau ubah data kendaraan</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Admin only: info pemilik */}
            {userRole === "admin" && (
              <div className="space-y-4">
                <DetailItem
                  label="Nama Lengkap"
                  value={vehicle.user?.name || "-"}
                  icon={<User className="mr-2 h-4 w-4 text-gray-400" />}
                />
                <DetailItem
                  label="Email"
                  value={vehicle.user?.email || "-"}
                  icon={<Mail className="mr-2 h-4 w-4 text-gray-400" />}
                />
                <DetailItem
                  label="Sebagai"
                  value={vehicle.user?.occupation || "-"}
                  icon={<Briefcase className="mr-2 h-4 w-4 text-gray-400" />}
                />
              </div>
            )}

            {/* Detail kendaraan */}
            <div className="space-y-4">
              <DetailItem
                label="Plat Nomor"
                field="plateNumber"
                value={formData.plateNumber}
                isEditing={isEditing}
                onChange={(f, v) => setFormData({ ...formData, [f]: v })}
                icon={<Car className="mr-2 h-4 w-4 text-gray-400" />}
              />

              <DetailItem
                label="Brand"
                field="brand"
                value={formData.brand}
                isEditing={isEditing}
                onChange={(f, v) => setFormData({ ...formData, [f]: v })}
                icon={
                  vehicle.type?.toLowerCase() === "motor" ? (
                    <Bike className="mr-2 h-4 w-4 text-gray-400" />
                  ) : (
                    <Car className="mr-2 h-4 w-4 text-gray-400" />
                  )
                }
              />

              <DetailItem
                label="Model"
                field="modelName"
                value={formData.modelName}
                isEditing={isEditing}
                onChange={(f, v) => setFormData({ ...formData, [f]: v })}
                icon={
                  vehicle.type?.toLowerCase() === "motor" ? (
                    <Bike className="mr-2 h-4 w-4 text-gray-400" />
                  ) : (
                    <Car className="mr-2 h-4 w-4 text-gray-400" />
                  )
                }
              />

              <DetailItem
                label="Warna"
                field="color"
                value={formData.color}
                isEditing={isEditing}
                onChange={(f, v) => setFormData({ ...formData, [f]: v })}
                icon={
                  vehicle.type?.toLowerCase() === "motor" ? (
                    <Bike className="mr-2 h-4 w-4 text-gray-400" />
                  ) : (
                    <Car className="mr-2 h-4 w-4 text-gray-400" />
                  )
                }
              />
            </div>

            {/* Tombol */}
            <div className="flex flex-col gap-4 pt-2 sm:flex-row">
              {!isEditing ? (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => handleDelete(vehicle.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Menghapus..." : "Hapus"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Menyimpan..." : "Simpan"}
                  </Button>

                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        plateNumber: vehicle.plateNumber,
                        brand: vehicle.brand,
                        modelName: vehicle.modelName,
                        color: vehicle.color,
                        type: vehicle.type,
                      });
                    }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600"
                  >
                    Batal
                  </Button>
                </>
              )}
            </div>
          </CardContent>

          <div className="mt-1 text-center">
            <Button
              variant="ghost"
              onClick={() => router.push(getDashboardPath())}
              className="flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
