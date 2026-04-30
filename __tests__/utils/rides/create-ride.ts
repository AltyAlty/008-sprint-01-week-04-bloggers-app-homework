import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Express } from 'express';
import { createDriver } from '../drivers/create-driver';
import { generateBasicAuthToken } from '../auth/generate-admin-auth-token';
import { getCreateRideInputDTO } from './get-create-ride-input-dto';
import { SETTINGS } from '../../../src/core/settings/settings';
import { CreateRideAttributesInputDTO } from '../../../src/rides/application/dto/create-ride-attributes.input-dto';
import { WrappedDriverOutputDTO } from '../../../src/drivers/routers/output-dto/wrapped-driver.output-dto';
import { ResourceType } from '../../../src/core/types/domain/resource-type';

export const createRide = async (
  app: Express,
  rideDTO?: CreateRideAttributesInputDTO,
): Promise<WrappedDriverOutputDTO> => {
  const newDriver = await createDriver(app);
  const defaultRideData = getCreateRideInputDTO(newDriver.data.id);

  const testRideData = {
    data: {
      type: ResourceType.Rides,
      attributes: { ...defaultRideData, ...rideDTO },
    },
  };

  const createRideResponse = await request(app)
    .post(SETTINGS.RIDES_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testRideData)
    .expect(HttpStatus.Created);

  return createRideResponse.body;
};
