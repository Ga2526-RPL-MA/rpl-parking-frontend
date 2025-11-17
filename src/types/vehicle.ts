export type Vehicle ={
  id: number;
  plateNumber: string;
  brand: string;
  modelName: string;
  color: string;
  type: string;
  isParked: boolean;  
  user: {
    name: string;
    email: string;
  };
}
