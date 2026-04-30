import 'dotenv/config';
import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/auth/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { clearDb } from '../../utils/db/clear-db';
import { runDB, stopDb } from '../../../src/db/mongodb/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { ResourceType } from '../../../src/core/types/domain/resource-type';
import { Currency } from '../../../src/rides/types/currency.type';
import { createRide } from '../../utils/rides/create-ride';

describe('Rides API body validation check', () => {
  const app = express();
  setupApp(app);
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    await clearDb(app);
  });

  afterAll(async () => await stopDb());

  it(`❌ should not create a ride when incorrect body passed; POST /api/rides'`, async () => {
    await request(app).post(SETTINGS.RIDES_PATH).send({}).expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
      .post(SETTINGS.RIDES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          type: ResourceType.Rides,
          attributes: {
            clientName: '   ',
            price: 'bla bla',
            currency: 1,
            fromAddress: '',
            toAddress: true,
            driverId: 'bam',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errors).toHaveLength(6);

    const invalidDataSet2 = await request(app)
      .post(SETTINGS.RIDES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          type: ResourceType.Rides,
          attributes: {
            clientName: 'LA',
            price: 0,
            currency: 'byn',
            fromAddress: 'street',
            driverId: 0,
            toAddress: 'test address',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet2.body.errors).toHaveLength(5);

    const invalidDataSet3 = await request(app)
      .post(SETTINGS.RIDES_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send({
        data: {
          type: ResourceType.Rides,
          attributes: {
            driverId: 5000,
            clientName: 'Sam',
            price: 100,
            currency: Currency.USD,
            fromAddress: 'test address',
            toAddress: 'test address',
          },
        },
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet3.body.errors).toHaveLength(1);
    const getRidesListResponse = await request(app).get(SETTINGS.RIDES_PATH).set('Authorization', adminToken);
    expect(getRidesListResponse.body.data).toHaveLength(0);
  });

  it('❌ should not finish an already finished ride; POST /api/rides/:id/actions/finish', async () => {
    const createdRide = await createRide(app);
    const createdRideId = createdRide.data.id;

    await request(app)
      .post(`${SETTINGS.RIDES_PATH}/${createdRideId}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .post(`${SETTINGS.RIDES_PATH}/${createdRideId}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.UnprocessableEntity);
  });
});
