// List kendaraan (Dashboard)
export const adminVehicleListRoute = `/dashboard`;
export const userVehicleListRoute = `/dashboard/user`;

// Detail kendaraan
export const vehicleDetailRoute = (id: string | number) =>
  `/dashboard/${id}`;

// Edit kendaraan
export const vehicleEditRoute = (id: string | number) =>
  `/kendaraan/edit/${id}`;
