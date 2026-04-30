import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { getCreateDriverInputDTO } from './get-create-driver-input-dto';
import { SETTINGS } from '../../../src/core/settings/settings';
import { CreateDriverAttributesInputDTO } from '../../../src/drivers/application/dto/create-driver-attributes.input-dto';
import { WrappedDriverOutputDTO } from '../../../src/drivers/routers/output-dto/wrapped-driver.output-dto';
import { CreateDriverDataInputDTO } from '../../../src/drivers/routers/input-dto/create-driver-data.input-dto';
import { ResourceType } from '../../../src/core/types/domain/resource-type';

/*Функция "createDriver()", создающая водителя и возвращающая данные о нем, для целей тестирования.*/
export const createDriver = async (
  app: Express,
  driverDTO?: CreateDriverAttributesInputDTO,
): Promise<WrappedDriverOutputDTO> => {
  /*Получаем DTO с корректными данными для создания водителя для целей тестирования.*/
  const testDriverData: CreateDriverDataInputDTO = {
    data: {
      type: ResourceType.Drivers,
      attributes: { ...getCreateDriverInputDTO(), ...driverDTO },
    },
  };

  /*Создаем водителя.*/
  const createDriverResponse = await request(app)
    .post(SETTINGS.DRIVERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.Created);

  /*Возвращаем тело ответа.*/
  return createDriverResponse.body;
};
