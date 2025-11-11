import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";

import { GetAllUsersResponse } from "@/types/user";

export const useGetUsers = (enabled = false) => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get<GetAllUsersResponse>("/users");
      return response.data;
    },
    enabled,
  });
  return { data, isLoading };
};
