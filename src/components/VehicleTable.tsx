"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Switch } from "@/components/ui/switch";

import { useToggleParking } from "@/app/kendaraan/hooks/useMutateVehicle";

interface Vehicle {
  id: number;
  plateNumber: string;
  brand: string;
  modelName: string;
  color: string;
  type: string;
  user: {
    name: string;
    email: string;
  };
}

interface Props {
  data: Vehicle[];
}

export default function VehicleTable({ data }: Props) {
  const router = useRouter();

  // State toggle parkir untuk masing-masing kendaraan
  const [parkingState, setParkingState] = useState<Record<number, boolean>>({});

  const { mutate: toggleParking } = useToggleParking();

const handleToggle = (id: number, val: boolean) => {
  const status = val ? "in" : "out";

  // Update UI dulu (optimistic UI)
  setParkingState((prev) => ({
    ...prev,
    [id]: val,
  }));

  toggleParking(
    { id, status },
    {
      onError: () => {
        // rollback UI jika gagal
        setParkingState((prev) => ({
          ...prev,
          [id]: !val,
        }));
      },
    }
  );
};



  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="max-h-[400px] overflow-auto">
        <table className="w-full table-fixed">
          <thead className="sticky top-0 z-10 bg-blue-600 text-white">
            <tr>
              <th className="w-[120px] p-4 text-center text-sm font-semibold">
                Plat Nomor
              </th>

              <th className="w-[150px] p-4 text-center text-sm font-semibold">
                Pemilik
              </th>

              <th className="w-[140px] p-4 text-center text-sm font-semibold">
                Jenis
              </th>

              {/* Toggle Parkir — Kolom Baru */}
              <th className="w-[120px] p-4 text-center text-sm font-semibold">
                Parkir
              </th>

              <th className="w-[120px] p-4 text-center text-sm font-semibold">
                Merk
              </th>

              <th className="w-[120px] p-4 text-center text-sm font-semibold">
                Model
              </th>

              <th className="w-[80px] p-4 text-center text-sm font-semibold">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="mb-2 text-3xl">🚗</div>
                    <p>Tidak ada data kendaraan</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-t border-gray-200 transition-colors hover:bg-blue-50"
                >
                  {/* Plat Nomor */}
                  <td className="p-4 text-center font-medium text-gray-900">
                    {vehicle.plateNumber}
                  </td>

                  {/* Pemilik */}
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-sm font-medium text-gray-900">
                        {vehicle.user.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {vehicle.user.email}
                      </p>
                    </div>
                  </td>

                  {/* Jenis */}
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        vehicle.type.toLowerCase() === "mobil"
                          ? "border border-yellow-300 bg-yellow-100 text-yellow-700"
                          : "border border-blue-300 bg-blue-100 text-blue-700"
                      }`}
                    >
                      {vehicle.type}
                    </span>
                  </td>

                  {/* Toggle status Parkir */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center">
                      <Switch
                        checked={parkingState[vehicle.id] ?? false}
                        onCheckedChange={(val) =>
                          handleToggle(vehicle.id, val)
                        }
                      />
                      <span className="ml-2 text-sm font-medium">
                        {parkingState[vehicle.id] ? "in" : "out"}
                      </span>
                    </div>
                  </td>

                  {/* Merk */}
                  <td className="p-4 text-center font-medium text-gray-900">
                    {vehicle.brand}
                  </td>

                  {/* Model */}
                  <td className="p-4 text-center font-medium text-gray-900">
                    {vehicle.modelName}
                  </td>

                  {/* Aksi */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => router.push(`/dashboard/${vehicle.id}`)}
                      className="text-sm font-medium text-blue-600 hover:cursor-pointer hover:text-blue-800 hover:underline"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
