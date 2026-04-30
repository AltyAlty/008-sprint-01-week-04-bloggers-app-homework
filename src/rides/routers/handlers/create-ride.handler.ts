import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToWrappedRideOutputDTO } from '../../repositories/mappers/map-to-wrapped-ride-output-dto.util';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { CreateRideDataInputDTO } from '../input-dto/create-ride-data.input-dto';
import { ridesQueryRepository } from '../../repositories/rides.query-repository';

export const createRideHandler = async (req: Request<{}, {}, CreateRideDataInputDTO>, res: Response) => {
  try {
    const createdRideId = await ridesService.create(req.body.data.attributes);
    const createdRide = await ridesQueryRepository.findById(createdRideId);
    const rideOutput = mapToWrappedRideOutputDTO(createdRide);
    res.status(HttpStatus.Created).send(rideOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
