import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { SETTINGS } from '../../../src/core/settings/settings';
import { WrappedDriverOutputDTO } from '../../../src/drivers/routers/output-dto/wrapped-driver.output-dto';

/*Функция "getDriverById()", получающая данные о водителе по ID и возвращающая их, для целей тестирования.*/
export const getDriverById = async (app: Express, driverId: string): Promise<WrappedDriverOutputDTO> => {
  /*Получаем данные о водителе.*/
  const getDriverResponse = await request(app)
    .get(`${SETTINGS.DRIVERS_PATH}/${driverId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  /*Возвращаем тело ответа.*/
  return getDriverResponse.body;
};
