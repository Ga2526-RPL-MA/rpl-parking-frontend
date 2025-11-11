import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import api from "@/lib/api";

import { useAuthStore } from "@/store/useAuthStore";

export type CreateVehiclePayload = {
  userId?: string;
  plateNumber: string;
  image: string;
  type: "motor" | "mobil";
  brand: string;
  modelName: string;
  color: string;
};
export type PlateNumberCheckResponse = {
  message: string;
  data: {
    plateNumber: string;
    image: string;
  };
};

export const useCreateVehicle = () => {
  return useMutation({
    mutationFn: async (payload: CreateVehiclePayload) => {
      const res = await api.post("/vehicles", payload);
      return res.data;
    },
  });
};

export const usePlateNumberCheck = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post<PlateNumberCheckResponse>(
        "/vehicles/plate",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Berhasil deteksi plat nomor");
    },
    onError: () => {
      toast.error("Gagal mendeteksi plat nomor", {
        description:
          "Mohon upload gambar dengan plat nomor yang terlihat jelas",
      });
    },
  });
  return { mutate, isPending };
};

export const useDeleteVehicle = () => {
  const userRole = useAuthStore((state) => state.user?.role);
  const getDashboardPath = () => {
    return userRole === "admin" ? "/dashboard" : "/dashboard/user";
  };

  const router = useRouter();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/vehicles/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Kendaraan berhasil dihapus");
      router.push(getDashboardPath());
    },
    onError: () => {
      toast.error("Gagal menghapus kendaraan");
    },
  });
};

export const useUpdateVehicle = () => {
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateVehiclePayload>;
    }) => {
      const res = await api.patch(`/vehicles/${id}`, payload);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Kendaraan berhasil diperbarui");
    },

    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.messsage ||
        "Gagal update kendaraan";

      toast.error("Gagal memperbarui kendaraan", {
        description: msg,
      });
    },
  });
};
