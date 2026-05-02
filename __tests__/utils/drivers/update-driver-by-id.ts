import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { SETTINGS } from '../../../src/core/settings/settings';
import { getUpdateDriverInputDTO } from './get-update-driver-input-dto';
import { UpdateDriverAttributesInputDTO } from '../../../src/drivers/application/dto/update-driver-attributes.input-dto';
import { ResourceType } from '../../../src/core/types/domain/resource-type';
import { UpdateDriverDataInputDTO } from '../../../src/drivers/routers/input-dto/update-driver-data.input-dto';

/*Создаем функцию "updateDriverById()", изменяющую данные водителя по ID и возвращающую их, для целей тестирования.*/
export const updateDriverById = async (
  app: Express,
  driverId: string,
  driverDTO?: UpdateDriverAttributesInputDTO,
): Promise<void> => {
  /*Получаем DTO с корректными данными для изменения водителя для целей тестирования.*/
  const testDriverData: UpdateDriverDataInputDTO = {
    data: {
      type: ResourceType.Blogs,
      id: driverId,
      attributes: { ...getUpdateDriverInputDTO(), ...driverDTO },
    },
  };

  /*Изменяем водителя.*/
  const updateDriverResponse = await request(app)
    .put(`${SETTINGS.BLOGS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testDriverData)
    .expect(HttpStatus.NoContent_204);

  /*Возвращаем тело ответа.*/
  return updateDriverResponse.body;
};
