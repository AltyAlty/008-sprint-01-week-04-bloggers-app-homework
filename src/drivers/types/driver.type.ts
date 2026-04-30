import { VehicleFeature } from './vehicle-features.type';

/*Тип для водителей.*/
export type DriverType = {
  name: string;
  phoneNumber: string;
  email: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    description: string | null;
    features: VehicleFeature[];
  };
  createdAt: Date;
};
