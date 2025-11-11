import { ApiResponse } from "./api";
import { Vehicle } from "./vehicle";

export type GetAllUsersResponse = ApiResponse<User[]>;

export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  occupation: "mahasiswa" | "dosen" | "tendik";
  vehicles: Vehicle[];
};
export type WithToken = {
  token: string;
};
