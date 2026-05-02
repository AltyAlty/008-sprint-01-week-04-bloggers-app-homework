import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { SETTINGS } from '../../../src/core/settings/settings';
import { WrappedDriverOutputDTO } from '../../../src/drivers/routers/output-dto/wrapped-driver.output-dto';

export const getRideById = async (
  app: Express,
  rideId: string,
  expectedStatus?: HttpStatus,
): Promise<WrappedDriverOutputDTO> => {
  const testStatus = expectedStatus ?? HttpStatus.Ok_200;

  const getRideResponse = await request(app)
    .get(`${SETTINGS.POSTS_PATH}/${rideId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(testStatus);

  return getRideResponse.body;
};
