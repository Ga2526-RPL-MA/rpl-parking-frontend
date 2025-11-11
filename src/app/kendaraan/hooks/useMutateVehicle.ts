import { useMutation } from "@tanstack/react-query";

import api from "@/lib/api";

export type CreateVehiclePayload = {
  userId?: string;
  plateNumber: string;
  image: string;
  type: "motor" | "mobil";
  brand: string;
  modelName: string;
  color: string;
};

export const useCreateVehicle = () => {
  return useMutation({
    mutationFn: async (payload: CreateVehiclePayload) => {
      const res = await api.post("/vehicles", payload);
      return res.data;
    },
  });
};

export type PlateNumberCheckResponse = {
  message: string;
  data: {
    plateNumber: string;
    image: string;
  };
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
  });
  return { mutate, isPending };
};
