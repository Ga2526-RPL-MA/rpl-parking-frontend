"use client";

import { useRouter } from "next/navigation";

interface Vehicle {
  id: number;
  plateNumber: string;
  type: string;
}

interface Props {
  data: Vehicle[];
}

export default function UserVehicleTable({ data }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-gray-200 shadow-sm bg-white">
      {/* Container untuk scroll */}
      <div className="overflow-auto max-h-[400px]">
        <table className="w-full table-fixed">
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              <th className="p-4 font-semibold text-sm text-center w-1/3">Plat Nomor</th>
              <th className="p-4 font-semibold text-sm text-center w-1/3">Jenis</th>
              <th className="p-4 font-semibold text-sm text-center w-1/3">Aksi</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {data.length === 0 ? (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={3}>
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="text-3xl mb-2">🚗</div>
                    <p className="text-sm">Belum ada kendaraan terdaftar</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((vehicle) => (
                <tr 
                  key={vehicle.id}
                  className="border-t border-gray-200 hover:bg-blue-50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-900 text-center w-1/3">
                    {vehicle.plateNumber}
                  </td>

                  <td className="p-3 text-center w-1/3">
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          vehicle.type.toLowerCase() === "mobil"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {vehicle.type}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-center w-1/3">
                    <button
                      onClick={() => router.push(`/dashboard/${vehicle.id}`)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
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