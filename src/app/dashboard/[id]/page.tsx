"use client";

import { ArrowLeft, Bike,Car, Mail, User } from "lucide-react"; 
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getVehicleById } from "@/lib/api"; 

import NextImage from "@/components/NextImage"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; 

interface DetailItemProps {
  label: string;
  value: string | number;
  badge?: string;
  icon?: React.ReactNode;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, badge, icon }) => (
  <div className="flex flex-col">
    <label className="text-xs font-normal text-gray-500 mb-1">{label}</label>
    <div className="flex items-center justify-between border-b border-gray-200 pb-1">
      <div className="flex items-center">
        {icon}
        <p className="text-base text-gray-800">{value}</p>
      </div>
      {badge && (
        <span 
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            badge.toLowerCase() === "mahasiswa" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {badge}
        </span>
      )}
    </div>
  </div>
);
// --- Akhir Komponen DetailItem ---

export default function DetailKendaraanPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("user");


  useEffect(() => {
    async function load() {
      try {
        const data = await getVehicleById(id as string);
        setVehicle(data.data);
        
        const userData = sessionStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          setUserRole(user?.role?.toLowerCase() || "user");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const getDashboardPath = () => {
    return userRole === "admin" ? "/dashboard" : "/dashboard/user";
  };

  const handleDelete = async () => {
    if (confirm("Yakin hapus kendaraan ini?")) {
      // memakai getDashboardPath supaya setelah hapus, user diarahkan ke dashboard sesuai role
      await fetch(`/vehicles/${id}`, { method: "DELETE" }); 
      router.push(getDashboardPath());
    }
  };

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


  return (
    <div className="h-screen flex ">
      
      {/* Kolom Kiri: Gambar Potrait */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Menggunakan NextImage dan menyesuaikan agar menutupi seluruh div */}
        <NextImage
          src="/car2.png" 
          alt="Kendaraan"
          
          className="object-cover w-full h-full"
          width={690} 
          height={1000} // ga terlalu pengaruh
        />
        {/* Opsional: Tambahkan overlay jika diperlukan, tapi kita ikuti desain */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Kolom Kanan: Form Detail*/}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-[#B6B6B6] via-[#FFFFFF] to-[#B8D3FF]">
        <Card className="w-full max-w-lg shadow-xl border-none p-6 sm:p-8">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-semibold text-gray-900">Detail Kendaraan</CardTitle>
            <CardDescription className="text-gray-500 mt-2">
              Lihat dan kelola data kendaraan yang terdaftar di sistem kampus
            </CardDescription>
          </CardHeader>
              <CardContent className="space-y-8">

      {/* Informasi Pemilik — hanya untuk Admin */}
      {userRole === "admin" && (
        <div className="space-y-4">
          <DetailItem 
            label="Nama Lengkap" 
            value={vehicle.user?.name || '-'}
            badge={vehicle.user?.occupation || "Mahasiswa"}
            icon={<User className="h-4 w-4 mr-2 text-gray-400" />}
          />
          <DetailItem 
            label="Email" 
            value={vehicle.user?.email || '-'}
            icon={<Mail className="h-4 w-4 mr-2 text-gray-400" />}
          />
        </div>
      )}

          {/* Informasi Kendaraan */}
    <div className="space-y-4">

      {/* Plat Nomor + Jenis Kendaraan (badge) */}
      <DetailItem 
        label="Plat Nomor" 
        value={vehicle.plateNumber || '-'}
        badge={vehicle.type || "Mobil"}
        icon={
          vehicle.type?.toLowerCase() === "motor"
            ? <Bike className="h-4 w-4 mr-2 text-gray-400" />
            : <Car className="h-4 w-4 mr-2 text-gray-400" />
        }
      />

      {/* Brand */}
      <DetailItem
        label="Brand"
        value={vehicle.brand || '-'}
        icon={
          vehicle.type?.toLowerCase() === "motor"
            ? <Bike className="h-4 w-4 mr-2 text-gray-400" />
            : <Car className="h-4 w-4 mr-2 text-gray-400" />
        }
      />

      {/* Model */}
      <DetailItem
        label="Model"
        value={vehicle.modelName || '-'}
        icon={
          vehicle.type?.toLowerCase() === "motor"
            ? <Bike className="h-4 w-4 mr-2 text-gray-400" />
            : <Car className="h-4 w-4 mr-2 text-gray-400" />
        }
      />

      {/* Warna */}
      <DetailItem
        label="Warna"
        value={vehicle.color || '-'}
        icon={
          vehicle.type?.toLowerCase() === "motor"
            ? <Bike className="h-4 w-4 mr-2 text-gray-400" />
            : <Car className="h-4 w-4 mr-2 text-gray-400" />
        }
      />
    </div>

    {/* Tombol Aksi admin & user */}
    {(userRole === "admin" ||
      vehicle.user?.id === JSON.parse(sessionStorage.getItem("user") || "{}")?.id
    ) && (
      <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => router.push(`/kendaraan/edit/${id}`)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
          size="lg"
        >
          Edit
        </Button>
        <Button
          onClick={handleDelete}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2"
          size="lg"
        >
          Hapus Data
        </Button>
      </div>
    )}

    </CardContent>
          
          {/* Tombol Kembali */}
          <div className="text-center mt-1">
            <Button 
              variant="ghost" 
              onClick={() => router.push(getDashboardPath())}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
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