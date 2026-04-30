import 'dotenv/config';
import request from 'supertest';
import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { generateBasicAuthToken } from '../../utils/auth/generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { clearDb } from '../../utils/db/clear-db';
import { createRide } from '../../utils/rides/create-ride';
import { getRideById } from '../../utils/rides/get-ride-by-id';
import { runDB, stopDb } from '../../../src/db/mongodb/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';

describe('Rides API', () => {
  const app = express();
  setupApp(app);
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    await clearDb(app);
  });

  afterAll(async () => await stopDb());

  it('✅ should create a ride; POST /api/rides', async () => await createRide(app));

  it('✅ should return a list of rides; GET /api/rides', async () => {
    await createRide(app);

    const getRidesListResponse = await request(app)
      .get(SETTINGS.RIDES_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok);

    expect(getRidesListResponse.body.data).toBeInstanceOf(Array);
    expect(getRidesListResponse.body.data).toHaveLength(2);
  });

  it('✅ should return a ride by ID; GET /api/rides/:id', async () => {
    const createdRide = await createRide(app);
    const createdRideId = createdRide.data.id;
    const getRideResponse = await getRideById(app, createdRideId);
    expect(getRideResponse.data.id).toBe(createdRideId);
    expect(getRideResponse.data.attributes).toEqual(createdRide.data.attributes);
  });

  it('✅ should finish a ride; POST /api/rides/:id/actions/finish', async () => {
    const createdRide = await createRide(app);
    const createdRideId = createdRide.data.id;

    await request(app)
      .post(`${SETTINGS.RIDES_PATH}/${createdRideId}/actions/finish`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    const getRideResponse = await getRideById(app, createdRideId);

    expect(getRideResponse.data.id).toBe(createdRideId);
    expect(getRideResponse.data.attributes).toEqual({
      ...createdRide.data.attributes,
      finishedAt: expect.any(String),
    });
  });
});
