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
import { runDB, stopDb } from '../../../src/db/mongodb/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { CreateDriverDataInputDTO } from '../../../src/drivers/routers/input-dto/create-driver-data.input-dto';
import { CreateDriverAttributesInputDTO } from '../../../src/drivers/application/dto/create-driver-attributes.input-dto';
import { ResourceType } from '../../../src/core/types/domain/resource-type';
import { UpdateDriverDataInputDTO } from '../../../src/drivers/routers/input-dto/update-driver-data.input-dto';
import { VehicleFeature } from '../../../src/drivers/types/vehicle-features.type';

describe('Drivers API body validation check', () => {
  const app = express();
  setupApp(app);
  const adminToken = generateBasicAuthToken();
  const correctTestDriverAttributes: CreateDriverAttributesInputDTO = getCreateDriverInputDTO();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    await clearDb(app);
  });

  afterAll(async () => await stopDb());

  /*Описываем тест, проверяющий отказ в добавлении водителя с непрошедшими валидацию данными.*/
  it('❌ should not create a driver when incorrect body passed; POST /api/drivers', async () => {
    const correctTestDriverData: CreateDriverDataInputDTO = {
      data: {
        type: ResourceType.Drivers,
        attributes: correctTestDriverAttributes,
      },
    };

    await request(app).post(SETTINGS.DRIVERS_PATH).send(correctTestDriverData).expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(SETTINGS.DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: '   ',
            phoneNumber: '    ',
            email: 'invalid email',
            vehicleMake: '', //
            vehicleModel: 'A6',
            vehicleYear: 2020,
            vehicleLicensePlate: 'XYZ-456',
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errors).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .post(SETTINGS.DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: 'Feodor',
            phoneNumber: '',
            email: 'feodor@example.com',
            vehicleModel: '',
            vehicleLicensePlate: '',
            vehicleMake: '',
            vehicleYear: 2020,
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errors).toHaveLength(4);

    const invalidDataSet3 = await request(app)
      .post(SETTINGS.DRIVERS_PATH)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: 'Feodor',
            email: 'feodor@example.com',
            phoneNumber: '',
            vehicleModel: '',
            vehicleLicensePlate: '',
            vehicleMake: '',
            vehicleYear: 2020,
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errors).toHaveLength(4);
    const getDriverListResponse = await request(app).get(SETTINGS.DRIVERS_PATH).set('Authorization', adminToken);
    expect(getDriverListResponse.body.data).toHaveLength(0);
  });

  /*Описываем тест, проверяющий отказ в изменении данных водителя с непрошедшими валидацию данными.*/
  it('❌ should not update a driver when incorrect body passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctTestDriverAttributes);
    const createdDriverId = createdDriver.data.id;

    const correctTestDriverData: UpdateDriverDataInputDTO = {
      data: {
        type: ResourceType.Drivers,
        id: createdDriverId,
        attributes: correctTestDriverAttributes,
      },
    };

    const invalidDataSet1 = await request(app)
      .put(`${SETTINGS.DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: '   ',
            phoneNumber: '    ',
            email: 'invalid email',
            vehicleMake: '',
            vehicleModel: 'A6',
            vehicleYear: 2020,
            vehicleLicensePlate: 'XYZ-456',
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errors).toHaveLength(4);

    const invalidDataSet2 = await request(app)
      .put(`${SETTINGS.DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: 'Ted',
            email: 'ted@example.com',
            vehicleMake: 'Audi',
            vehicleYear: 2020,
            vehicleDescription: null,
            vehicleFeatures: [],
            phoneNumber: '',
            vehicleModel: '',
            vehicleLicensePlate: '',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errors).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .put(`${SETTINGS.DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: 'A',
            phoneNumber: '987-654-3210',
            email: 'feodor@example.com',
            vehicleMake: 'Audi',
            vehicleModel: 'A6',
            vehicleYear: 2020,
            vehicleLicensePlate: 'XYZ-456',
            vehicleDescription: null,
            vehicleFeatures: [],
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errors).toHaveLength(1);
    const getDriverResponse = await getDriverById(app, createdDriverId);
    expect(getDriverResponse).toEqual({ ...createdDriver });
  });

  /*Описываем тест, проверяющий отказ в изменении данных водителя с непрошедшими валидацию данными о фичах машины.*/
  it('❌ should not update a driver when incorrect features passed; PUT /api/drivers/:id', async () => {
    const createdDriver = await createDriver(app, correctTestDriverAttributes);
    const createdDriverId = createdDriver.data.id;

    const correctTestDriverData: UpdateDriverDataInputDTO = {
      data: {
        type: ResourceType.Drivers,
        id: createdDriverId,
        attributes: correctTestDriverAttributes,
      },
    };

    await request(app)
      .put(`${SETTINGS.DRIVERS_PATH}/${createdDriverId}`)
      .set('Authorization', adminToken)
      .send({
        data: {
          ...correctTestDriverData.data,
          attributes: {
            name: 'Ted',
            phoneNumber: '987-654-3210',
            email: 'ted@example.com',
            vehicleMake: 'Audi',
            vehicleModel: 'A6',
            vehicleYear: 2020,
            vehicleLicensePlate: 'XYZ-456',
            vehicleDescription: null,
            vehicleFeatures: [VehicleFeature.ChildSeat, 'invalid-feature' as VehicleFeature, VehicleFeature.WiFi],
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    const getDriverResponse = await getDriverById(app, createdDriverId);
    expect(getDriverResponse).toEqual({ ...createdDriver });
  });
});
