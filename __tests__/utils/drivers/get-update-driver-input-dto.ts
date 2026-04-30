import { UpdateDriverAttributesInputDTO } from '../../../src/drivers/application/dto/update-driver-attributes.input-dto';

/*Функция "getUpdateDriverInputDTO()", возвращающая DTO с корректными данными для изменения водителя, для целей
тестирования.*/
export const getUpdateDriverInputDTO = (): UpdateDriverAttributesInputDTO => {
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
