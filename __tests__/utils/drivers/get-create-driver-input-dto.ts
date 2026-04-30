import { CreateDriverAttributesInputDTO } from '../../../src/drivers/application/dto/create-driver-attributes.input-dto';

/*Функция "getCreateDriverInputDTO()", возвращающая DTO с корректными данными для создания водителя, для целей
тестирования.*/
export const getCreateDriverInputDTO = (): CreateDriverAttributesInputDTO => {
  return {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: null,
    vehicleFeatures: [],
  };
};
