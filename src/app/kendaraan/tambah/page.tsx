"use client";

// TODO : Lengkapi fitur tambah kendaraan dengan integrasi API add Kendaraan dan OCR plat nomor
// TODO : add kendaraan sama edit kendaraan sama-sama belum fix bg buat strukturnya, jadi blum kehandle juga, masih layout sama beberapa fetch data kendaraan aja

import { ArrowLeft,} from "lucide-react"; 
import { useParams,useRouter } from "next/navigation";
import {useState } from "react";

import { createVehicle, getVehicleByPlate } from "@/lib/api";

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

export default function TambahKendaraanPage() {
  const [form, setForm] = useState({
    owner: "",
    plate: "",
    email: "",
    type: "Mobil",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const { id } = useParams();

  // Load user role from session storage

  // useEffect(() => {
  //   async function load() {
  //     try {
  //       const data = await getVehicleById(id as string);
  //       setVehicle(data.data);
        
  //       const userData = sessionStorage.getItem("user");
  //       if (userData) {
  //         const user = JSON.parse(userData);
  //         setUserRole(user?.role?.toLowerCase() || "user");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   load();
  // }, [id]);

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

  // const getDashboardPath = () => {
  //   return userRole === "admin" ? "/dashboard" : "/dashboard/user";
  // };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#B6B6B6] via-[#FFFFFF] to-[#B8D3FF]">
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

            {/* Jenis */}
        <div className="space-y-2">
          <Label>Jenis Kendaraan</Label>
          <Select
            //value={vehicle.type}
            //onValueChange={(val) => setVehicle({ ...vehicle, type: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Motor" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="Motor">Motor</SelectItem>
              <SelectItem value="Mobil">Mobil</SelectItem>
            </SelectContent>
          </Select>
        </div>

            {/* Brand */}
        <div className="space-y-2">
          <Label>Brand Kendaraan</Label>
          <Input
            //value={vehicle.brand || ""}
            //onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })}
          />
        </div>

        {/* Warna */}
        <div className="space-y-2">
          <Label>Warna Kendaraan</Label>
          <Input
           // value={vehicle.color || ""}
            //onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
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
                  //setVehicle({ ...vehicle, photoFile: file });
                }
              }}
            />
            <p className="text-xs text-gray-500">
              Format yang didukung: PNG, JPG, JPEG
            </p>
          </div>

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

              {/* Tombol Kembali */}
              <div className="text-center mt-1">
            <Button 
              variant="ghost" 
              // onClick={() => router.push(getDashboardPath())}
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
