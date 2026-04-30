import { Currency } from '../../types/currency.type';

export type CreateRideAttributesInputDTO = {
  clientName: string;
  price: number;
  currency: Currency;
  driverId: string;
  fromAddress: string;
  toAddress: string;
};
