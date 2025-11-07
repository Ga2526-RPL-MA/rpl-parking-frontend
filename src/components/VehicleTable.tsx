"use client";

import { useRouter } from "next/navigation";

interface Vehicle {
  id: number;
  plate: string;
  owner: string;
  email: string;
  type: string;
}

interface Props {
  data: Vehicle[];
}

export default function VehicleTable({ data }: Props) {
  const router = useRouter();

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="bg-blue-100 text-gray-700">
          <th className="p-3">Plat Nomor</th>
          <th className="p-3">Pemilik</th>
          <th className="p-3">Email</th>
          <th className="p-3">Jenis</th>
          <th className="p-3">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((v) => (
          <tr key={v.id} className="border-t hover:bg-blue-50 transition">
            <td className="p-3 font-medium">{v.plate}</td>
            <td className="p-3">{v.owner}</td>
            <td className="p-3 text-gray-500">{v.email}</td>
            <td className="p-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
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
                className="text-blue-600 hover:underline"
              >
                Detail
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
