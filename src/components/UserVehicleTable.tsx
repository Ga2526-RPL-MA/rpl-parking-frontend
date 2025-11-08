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

export default function VehicleTable({ data }: Props) {
  const router = useRouter();

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <table className="w-full text-left text-gray-700">
        <thead className="bg-blue-600 text-white sticky top-0 z-10">
          <tr>
            <th className="p-3">Plat Nomor</th>
            <th className="p-6">Jenis</th>
            <th className="p-2">Detail</th>
          </tr>
        </thead>
      </table>

      {/* Scrollable body */}
      <div className="max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <table className="w-full text-left text-gray-700">
          <tbody>
            {data.map((v) => (
              <tr
                key={v.id}
                className="border-t hover:bg-blue-50 transition"
              >
                <td className="p-3 font-medium">{v.plateNumber}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      v.type === "Mobil"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {v.type}
                  </span>
                </td>

                <td className="p-3">
                  <button
                    onClick={() => router.push(`/dashboard/${v.id}`)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
