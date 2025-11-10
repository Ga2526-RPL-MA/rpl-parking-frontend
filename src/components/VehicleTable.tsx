"use client";

import { useRouter } from "next/navigation";

interface Vehicle {
  id: number;
  plateNumber: string;
  user: {
    name: string;
    email: string;
  };
  type: string;
}

interface Props {
  data: Vehicle[];
}

export default function VehicleTable({ data }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm bg-white">
      {/* Container untuk scroll */}
      <div className="overflow-auto max-h-[400px]">
        <table className="w-full table-fixed">
          {/* Sticky Header */}
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              <th className="p-4 font-semibold text-sm text-center w-1/4">
                Plat Nomor
              </th>
              <th className="p-4 font-semibold text-sm text-center w-1/4">
                Pemilik
              </th>
              <th className="p-4 font-semibold text-sm text-center w-1/4">
                Jenis
              </th>
              <th className="p-4 font-semibold text-sm text-center w-1/4">
                Aksi
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white">
            {data.length === 0 ? (
              <tr>
                <td 
                  className="p-6 text-center text-gray-500 text-sm" 
                  colSpan={4}
                >
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="text-3xl mb-2">🚗</div>
                    <p>Tidak ada data kendaraan</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((vehicle) => (
                <tr 
                  key={vehicle.id}
                  className="border-t border-gray-200 hover:bg-blue-50 transition-colors duration-150"
                >
                  {/* Plat Nomor */}
                  <td className="p-4 font-medium text-gray-900 text-center w-1/4">
                    {vehicle.plateNumber}
                  </td>

                  {/* Info Pemilik */}
                  <td className="p-4 text-center w-1/4">
                    <div className="flex flex-col items-center justify-center">
                      <p className="font-medium text-gray-900 text-sm">
                        {vehicle.user.name}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {vehicle.user.email}
                      </p>
                    </div>
                  </td>

                  {/* Jenis Kendaraan */}
                  <td className="p-4 text-center w-1/4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          vehicle.type.toLowerCase() === "mobil"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {vehicle.type}
                      </span>
                    </div>
                  </td>

                  {/* Tombol Aksi */}
                  <td className="p-4 text-center w-1/4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => router.push(`/dashboard/${vehicle.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                      >
                        Detail
                      </button>
                    </div>
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