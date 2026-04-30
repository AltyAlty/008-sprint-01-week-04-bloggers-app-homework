import { CreateRideAttributesInputDTO } from '../../../src/rides/application/dto/create-ride-attributes.input-dto';
import { Currency } from '../../../src/rides/types/currency.type';

export const getCreateRideInputDTO = (driverId: string): CreateRideAttributesInputDTO => {
  return {
    driverId,
    clientName: 'Bob',
    price: 200,
    currency: Currency.USD,
    fromAddress: '123 Main St, Springfield, IL',
    toAddress: '456 Elm St, Shelbyville, IL',
  };
};
