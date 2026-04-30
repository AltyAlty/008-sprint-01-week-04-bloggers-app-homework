import { ObjectId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { driversCollection } from '../../db/mongodb/mongo.db';
import { DriverType } from '../types/driver.type';
import { UpdateDriverAttributesInputDTO } from '../application/dto/update-driver-attributes.input-dto';

/*Репозиторий "driversRepository" для работы с данными по водителям в БД.*/
export const driversRepository = {
  /*Метод "create()" для добавления нового водителя в БД.*/
  async create(newDriver: DriverType): Promise<string> {
    /*Просим коллекцию "driversCollection" создать нового водителя в БД.*/
    const insertResult = await driversCollection.insertOne(newDriver);
    /*Возвращаем ID созданного водителя.*/
    return insertResult.insertedId.toString();
  },

  /*Метод "update()" для изменения данных водителя по ID в БД.*/
  async update(id: string, dto: UpdateDriverAttributesInputDTO): Promise<void> {
    /*Просим коллекцию "driversCollection" изменить данные водителя по ID в БД.*/
    const updateResult = await driversCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
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
        },
      },
    );

    /*Если водитель не был найден, то выкидываем ошибку с информацией об этом.*/
    if (updateResult.matchedCount < 1) throw new RepositoryNotFoundError('Driver does not exist');
    return;
  },

  /*Метод "delete()" для удаления водителя по ID в БД.*/
  async delete(id: string): Promise<void> {
    /*Просим коллекцию "driversCollection" удалить водителя по ID в БД.*/
    const deleteResult = await driversCollection.deleteOne({ _id: new ObjectId(id) });
    /*Если водитель не был найден, то выкидываем ошибку с информацией об этом.*/
    if (deleteResult.deletedCount < 1) throw new RepositoryNotFoundError('Driver not exist');
    return;
  },
};
