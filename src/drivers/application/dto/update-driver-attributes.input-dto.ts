import { VehicleFeature } from '../../types/vehicle-features.type';

/*DTO для свойства "attributes" во входных данных для изменения водителя.*/
export type UpdateDriverAttributesInputDTO = {
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
