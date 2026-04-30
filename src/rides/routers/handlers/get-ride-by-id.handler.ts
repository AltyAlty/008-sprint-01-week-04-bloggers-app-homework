import { Request, Response } from 'express';
import { mapToWrappedRideOutputDTO } from '../../repositories/mappers/map-to-wrapped-ride-output-dto.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { ridesQueryRepository } from '../../repositories/rides.query-repository';

export const getRideByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    const ride = await ridesQueryRepository.findById(id);
    const rideOutput = mapToWrappedRideOutputDTO(ride);
    res.status(HttpStatus.Ok).send(rideOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
