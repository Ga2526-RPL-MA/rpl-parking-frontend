"use client";

import { AxiosError } from "axios";
import { ArrowLeft, Camera, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Webcam from "react-webcam";
import { toast } from "sonner";

import LoadingAnimation from "@/components/Loading";
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

import { ApiError } from "@/types/api";

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
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const isAdmin = userRole === "admin";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateVehicleFormValues>({
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

  const { mutate: checkPlate, isPending: isPendingCheckPlate } = usePlateNumberCheck();
  const { mutate: createVehicle, isPending: isPendingCreateVehicle } = useCreateVehicle();
  const { data, isLoading: isLoadingGetUsers } = useGetUsers(isAdmin);
  const users = data?.data;

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
  }, [users]);

  useEffect(() => {
    const file = watch("imageFile");
    if (!file) return;
    const formData = new FormData();
    formData.append("plate", file);
    checkPlate(formData, {
      onSuccess: (res) => {
        setValue("plateNumber", res.data.plateNumber);
        setValue("imageUrl", res.data.image);
      },
      onError: () => toast.error("Gagal mendeteksi plat nomor."),
    });
  }, [watch("imageFile")]);

  const capturePhoto = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setValue("imageFile", file);
        setUseCamera(false);
        toast.success("Foto berhasil diambil!");
      });
  };

  const onSubmit = (form: CreateVehicleFormValues) => {
    const payload: CreateVehiclePayload = {
      plateNumber: form.plateNumber,
      image: form.imageUrl,
      type: form.type.toLowerCase() as "motor" | "mobil",
      brand: form.brand,
      modelName: form.modelName,
      color: form.color,
    };
    if (userRole === "admin") payload.userId = form.userId;
    createVehicle(payload, {
      onSuccess: () => {
        toast.success("Berhasil Menambah Kendaraan");
        router.push(userRole === "admin" ? "/dashboard" : "/dashboard/user");
      },
      onError: (error) => {
        const err = error as AxiosError<ApiError>;
        const msg = err.response?.data?.message || err.response?.data?.messsage || "";
        if (msg.includes("Unique constraint failed") && msg.includes("plateNumber")) {
          toast.error("Plat nomor sudah terdaftar!", {
            description: "Silakan cek kembali atau gunakan plat nomor lain.",
          });
          return;
        }
        toast.error("Gagal membuat kendaraan. Terjadi kesalahan.");
      },
    });
  };

  if (isLoadingGetUsers) return <LoadingAnimation />;

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#B6B6B6] via-[#FFFFFF] to-[#B8D3FF]">
      <div className="flex w-full flex-col justify-center px-16">
        <div className="mx-auto max-w-lg rounded-xl bg-white p-10 shadow-md">
          <h2 className="mb-1 text-2xl font-bold text-gray-800">Tambah Kendaraan</h2>
          <p className="mb-6 text-sm text-gray-500">Mohon Lengkapi Data Kendaraan</p>

          <div className="max-h-[70vh] overflow-y-auto pr-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {userRole === "admin" && (
                <div className="space-y-2">
                  <Label>Email Pemilik Kendaraan</Label>
                  <Controller
                    name="userId"
                    control={control}
                    rules={{ required: "Email user wajib dipilih" }}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
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
                  {errors.userId && <p className="text-sm text-red-500">* {errors.userId.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label>Foto Kendaraan</Label>

                {!useCamera ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={(e) => setValue("imageFile", e.target.files?.[0] || null)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUseCamera(true)}
                      className="flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" /> Gunakan Kamera
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 items-center">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: "environment" }}
                      className="rounded-lg border"
                    />
                    <div className="flex gap-2">
                      <Button onClick={capturePhoto} type="button" className="bg-blue-600">
                        Ambil Foto
                      </Button>
                      <Button
                        onClick={() => setUseCamera(false)}
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" /> Upload File
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-sm text-red-500">
                  * Pastikan Foto Kendaraan dan Plat Nomor Terlihat Jelas
                </p>
              </div>

              <div className="space-y-2">
                <Label>Plat Nomor</Label>
                <Input
                  placeholder="cth: L 111 ITS"
                  {...register("plateNumber", { required: "Plat nomor wajib diisi" })}
                  readOnly={isPendingCheckPlate}
                />
                <p className="text-sm text-gray-500 italic">
                  {isPendingCheckPlate ? "Mendeteksi Plat Nomor..." : ""}
                </p>
                {errors.plateNumber && (
                  <p className="text-sm text-red-500">* {errors.plateNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Jenis Kendaraan</Label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Jenis kendaraan wajib dipilih" }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                {errors.type && <p className="text-sm text-red-500">* {errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Merk Kendaraan</Label>
                <Input
                  {...register("brand", { required: "Merk kendaraan wajib diisi" })}
                  placeholder="cth: Suzuki"
                />
                {errors.brand && <p className="text-sm text-red-500">* {errors.brand.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Model Kendaraan</Label>
                <Input
                  {...register("modelName", { required: "Model kendaraan wajib diisi" })}
                  placeholder="cth: XL7"
                />
                {errors.modelName && (
                  <p className="text-sm text-red-500">* {errors.modelName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Warna Kendaraan</Label>
                <Input
                  {...register("color", { required: "Warna kendaraan wajib diisi" })}
                  placeholder="cth: Hitam"
                />
                {errors.color && <p className="text-sm text-red-500">* {errors.color.message}</p>}
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-blue-600"
                  disabled={isPendingCreateVehicle || !watch("imageUrl")}
                >
                  {isPendingCreateVehicle ? "Loading..." : "Tambah"}
                </Button>
              </div>

              <div className="mt-1 text-center">
                <Button
                  variant="ghost"
                  onClick={() =>
                    router.push(userRole === "admin" ? "/dashboard" : "/dashboard/user")
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
    </div>
  );
}
