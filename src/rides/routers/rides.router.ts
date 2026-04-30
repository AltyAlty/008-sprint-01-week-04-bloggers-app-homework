import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id-validation.middlewares';
import { rideCreateInputValidation } from '../validation/ride-input-validation.middlewares';
import { createRideHandler } from './handlers/create-ride.handler';
import { getRidesListHandler } from './handlers/get-rides-list.handler';
import { getRideByIdHandler } from './handlers/get-ride-by-id.handler';
import { finishRideHandler } from './handlers/finish-ride.handler';
import { paginationValidationMiddleWare } from '../../core/middlewares/validation/pagination-validation.middleware';
import { RideSortFieldInputDTO } from './input-dto/ride-sort-field.input-dto';

export const ridesRouter = Router({});
ridesRouter.use(superAdminGuardMiddleware);

ridesRouter
  .get('', paginationValidationMiddleWare(RideSortFieldInputDTO), inputValidationResultMiddleware, getRidesListHandler)
  .get('/:id', idValidation, inputValidationResultMiddleware, getRideByIdHandler)
  .post('', rideCreateInputValidation, inputValidationResultMiddleware, createRideHandler)
  .post('/:id/actions/finish', idValidation, inputValidationResultMiddleware, finishRideHandler);
