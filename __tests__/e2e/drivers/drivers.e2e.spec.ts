import 'dotenv/config';
import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/auth/generate-admin-auth-token';
import { clearDb } from '../../utils/db/clear-db';
import { getCreateDriverInputDTO } from '../../utils/drivers/get-create-driver-input-dto';
import { createDriver } from '../../utils/drivers/create-driver';
import { getDriverById } from '../../utils/drivers/get-driver-by-id';
import { updateDriverById } from '../../utils/drivers/update-driver-by-id';
import { runDB, stopDb } from '../../../src/db/mongodb/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { UpdateDriverAttributesInputDTO } from '../../../src/drivers/application/dto/update-driver-attributes.input-dto';
import { VehicleFeature } from '../../../src/drivers/types/vehicle-features.type';

/*Описываем тестовый набор.*/
describe('Drivers API', () => {
  /*Создание экземпляра приложения Express.*/
  const app = express();
  /*Настраиваем экземпляр приложения Express при помощи функции "setupApp()".*/
  setupApp(app);
  /*Генерируем токен для Basic авторизации.*/
  const adminToken = generateBasicAuthToken();

  /*Перед запуском тестов, запускаем и очищаем БД с данными по водителям.*/
  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    await clearDb(app);
  });

  /*После того как тесты отработают, отключаемся от БД с данными по водителям.*/
  afterAll(async () => await stopDb());

  /*Описываем тест, проверяющий добавление нового водителя в БД.*/
  it('✅ should create a driver; POST /api/drivers', async () => {
    await createDriver(app, {
      ...getCreateDriverInputDTO(),
      name: 'Feodor',
      email: 'feodor@example.com',
    });
  });

  /*Описываем тест, проверяющий получение данных по всем водителями из БД.*/
  it('✅ should return a list of drivers; GET /api/drivers', async () => {
    await Promise.all([createDriver(app), createDriver(app)]);

    const getDriverListResponse = await request(app)
      .get(SETTINGS.DRIVERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(getDriverListResponse.body.data).toBeInstanceOf(Array);
    expect(getDriverListResponse.body.data.length).toBeGreaterThanOrEqual(2);
  });

  /*Описываем тест, проверяющий получение данных по водителю по ID из БД.*/
  it('✅ should return a driver by ID; GET /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const createdDriverId = createdDriver.data.id;
    const driver = await getDriverById(app, createdDriverId);
    expect(driver).toEqual({ ...createdDriver });
  });

  /*Описываем тест, проверяющий изменение данных по водителю по ID в БД.*/
  it('✅ should update a driver by ID; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const createdDriverId = createdDriver.data.id;

    const updateDriverData: UpdateDriverAttributesInputDTO = {
      name: 'Updated Name',
      phoneNumber: '999-888-7777',
      email: 'updated@example.com',
      vehicleMake: 'Tesla',
      vehicleModel: 'Model S',
      vehicleYear: 2022,
      vehicleLicensePlate: 'NEW-789',
      vehicleDescription: 'Updated vehicle description',
      vehicleFeatures: [VehicleFeature.ChildSeat],
    };

    await updateDriverById(app, createdDriverId, updateDriverData);
    const getDriverResponse = await getDriverById(app, createdDriverId);
    expect(getDriverResponse.data.id).toBe(createdDriverId);

    expect(getDriverResponse.data.attributes).toEqual({
      name: updateDriverData.name,
      phoneNumber: updateDriverData.phoneNumber,
      email: updateDriverData.email,
      vehicle: {
        description: updateDriverData.vehicleDescription,
        features: updateDriverData.vehicleFeatures,
        licensePlate: updateDriverData.vehicleLicensePlate,
        make: updateDriverData.vehicleMake,
        model: updateDriverData.vehicleModel,
        year: updateDriverData.vehicleYear,
      },
      createdAt: expect.any(String),
    });
  });

  /*Описываем тест, проверяющий удаление водителя по ID в БД.*/
  it('✅ should delete a driver by ID; DELETE /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app);
    const createdDriverId = createdDriver.data.id;

    await request(app)
      .delete(`${SETTINGS.DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${SETTINGS.DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });
});
