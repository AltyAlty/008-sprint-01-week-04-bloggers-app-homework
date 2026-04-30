import { WithId } from 'mongodb';
import { ResourceType } from '../../../core/types/domain/resource-type';
import { DriverType } from '../../types/driver.type';
import { WrappedDriverOutputDTO } from '../../routers/output-dto/wrapped-driver.output-dto';

/*Функция "mapToWrappedDriverOutputDTO()" преобразовывает данные по водителю из БД в подготовленные для отправки клиенту
данные по водителю.*/
export const mapToWrappedDriverOutputDTO = (driver: WithId<DriverType>): WrappedDriverOutputDTO => {
  return {
    data: {
      type: ResourceType.Drivers,
      id: driver._id.toString(),
      attributes: {
        name: driver.name,
        phoneNumber: driver.phoneNumber,
        email: driver.email,
        vehicle: driver.vehicle,
        createdAt: driver.createdAt,
      },
    },
  };
};
