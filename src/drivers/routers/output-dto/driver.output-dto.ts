import { ResourceType } from '../../../core/types/domain/resource-type';
import { VehicleFeature } from '../../types/vehicle-features.type';

/*DTO для исходящих данных по водителям.*/
export type DriverOutputDTO = {
  type: ResourceType.Drivers;
  id: string;
  attributes: {
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
};
