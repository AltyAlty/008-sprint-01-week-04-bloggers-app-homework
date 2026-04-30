import { driversRepository } from '../repositories/drivers.repository';
import { ridesRepository } from '../../rides/repositories/rides.repository';
import { DomainError } from '../../core/errors/domain.error';
import { DriverType } from '../types/driver.type';
import { CreateDriverAttributesInputDTO } from './dto/create-driver-attributes.input-dto';
import { UpdateDriverAttributesInputDTO } from './dto/update-driver-attributes.input-dto';

/*Тип для ошибок, которые возникают во время обработки водителей в BLL.*/
export enum DriverErrorCode {
  HasActiveRide = 'DRIVER_HAS_ACTIVE_RIDE',
}

/*Сервис "driversService" для работы с данными по водителям.*/
export const driversService = {
  /*Метод "create()" для добавления нового водителя.*/
  async create(dto: CreateDriverAttributesInputDTO): Promise<string> {
    /*Создаем объект с данными нового водителя.*/
    const newDriver: DriverType = {
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      email: dto.email,
      vehicle: {
        make: dto.vehicleMake,
        model: dto.vehicleModel,
        year: dto.vehicleYear,
        licensePlate: dto.vehicleLicensePlate,
        description: dto.vehicleDescription,
        features: dto.vehicleFeatures,
      },
      createdAt: new Date(),
    };

    /*Просим репозиторий "driversRepository" создать нового водителя в БД.*/
    return driversRepository.create(newDriver);
  },

  /*Метод "update()" для изменения данных водителя по ID.*/
  async update(id: string, dto: UpdateDriverAttributesInputDTO): Promise<void> {
    /*Просим репозиторий "driversRepository" изменить данные водителя по ID в БД.*/
    await driversRepository.update(id, dto);
    return;
  },

  /*Метод "delete()" для удаления водителя по ID.*/
  async delete(id: string): Promise<void> {
    /*Просим репозиторий "ridesRepository" определить по ID водителя нет ли у него активных поездок.*/
    const activeRide = await ridesRepository.findActiveRideByDriverId(id);
    /*Если у водителя есть активные поездки, то выкидываем ошибку с информацией об этом.*/
    if (activeRide) throw new DomainError(`Driver is currently on a trip`, DriverErrorCode.HasActiveRide);
    /*Если у водителя нет активных поездок, то просим репозиторий "driversRepository" удалить водителя по ID в БД.*/
    await driversRepository.delete(id);
    return;
  },
};
