import { ResourceType } from '../../../core/types/domain/resource-type';
import { Currency } from '../../types/currency.type';

export type RideOutputDTO = {
  type: ResourceType.Rides;
  id: string;
  attributes: {
    clientName: string;
    driver: {
      id: string;
      name: string;
    };
    vehicle: {
      licensePlate: string;
      name: string;
    };
    price: number;
    currency: Currency;
    startedAt: Date | null;
    finishedAt: Date | null;
    addresses: {
      from: string;
      to: string;
    };
  };
};
