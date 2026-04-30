import { Router } from 'express';
import { getDriversListHandler } from './handlers/get-drivers-list.handler';
import { getDriverByIdHandler } from './handlers/get-driver-by-id.handler';
import { createDriverHandler } from './handlers/create-driver.handler';
import { updateDriverHandler } from './handlers/update-driver.handler';
import { deleteDriverHandler } from './handlers/delete-driver.handler';
import { idValidation } from '../../core/middlewares/validation/params-id-validation.middlewares';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import {
  driverCreateInputValidation,
  driverUpdateInputValidation,
} from '../validation/driver-input-validation.middlewares';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { paginationValidationMiddleWare } from '../../core/middlewares/validation/pagination-validation.middleware';
import { getDriverRidesListHandler } from './handlers/get-driver-rides-list.handler';
import { DriverSortFieldInputDTO } from './input-dto/driver-sort-field.input-dto';
import { RideSortFieldInputDTO } from '../../rides/routers/input-dto/ride-sort-field.input-dto';

/*Роутер из Express для работы с данными по водителям.*/
export const driversRouter = Router({});
/*Таким образом можно применить какой-то middleware ко всем маршрутам.*/
driversRouter.use(superAdminGuardMiddleware);

/*Конфигурируем роутер "driversRouter".*/
driversRouter
  /*GET-запрос для получения данных по всем водителям при помощи query-параметров.*/
  .get(
    '',
    paginationValidationMiddleWare(DriverSortFieldInputDTO),
    inputValidationResultMiddleware,
    getDriversListHandler,
  )
  /*GET-запрос для поиска водителя по ID при помощи URI-параметров. При помощи ":" Express позволяет указывать
  переменные в пути. Такие переменные доступны через объект "req.params".*/
  .get('/:id', idValidation, inputValidationResultMiddleware, getDriverByIdHandler)
  /*POST-запрос для добавления нового водителя.*/
  .post('', driverCreateInputValidation, inputValidationResultMiddleware, createDriverHandler)
  /*PUT-запрос для изменения данных водителя по ID при помощи URI-параметров.*/
  .put('/:id', idValidation, driverUpdateInputValidation, inputValidationResultMiddleware, updateDriverHandler)
  /*DELETE-запрос для удаления водителя по ID при помощи URI-параметров.*/
  .delete('/:id', idValidation, inputValidationResultMiddleware, deleteDriverHandler)
  /*GET-запрос для получения данных по поездкам водителя по ID при помощи URI-параметров и query-параметров.*/
  .get(
    '/:id/rides',
    idValidation,
    paginationValidationMiddleWare(RideSortFieldInputDTO),
    inputValidationResultMiddleware,
    getDriverRidesListHandler,
  );
