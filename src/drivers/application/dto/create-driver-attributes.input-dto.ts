import { VehicleFeature } from '../../types/vehicle-features.type';

/*DTO для свойства "attributes" во входных данных для создания нового водителя.*/
export type CreateDriverAttributesInputDTO = {
  name: string;
  phoneNumber: string;
  email: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleLicensePlate: string;
  vehicleDescription: string | null;
  vehicleFeatures: VehicleFeature[];
};
