import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { ridesService } from '../../application/rides.service';
import { errorsHandler } from '../../../core/errors/errors.handler';

export const finishRideHandler = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id;
    await ridesService.finishRide(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
