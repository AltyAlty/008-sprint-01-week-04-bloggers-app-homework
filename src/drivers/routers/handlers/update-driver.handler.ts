import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { driversService } from '../../application/drivers.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { UpdateDriverDataInputDTO } from '../input-dto/update-driver-data.input-dto';

/*Функция-обработчик "updateDriverHandler()" для PUT-запросов для изменения данных водителя по ID при помощи
URI-параметров.*/
export const updateDriverHandler = async (
  req: Request<{ id: string }, {}, UpdateDriverDataInputDTO>,
  res: Response,
) => {
  try {
    const id = req.params.id;
    /*Просим сервис "driversService" изменить данные водителя по ID.*/
    await driversService.update(id, req.body.data.attributes);
    /*Сообщаем клиенту, что водитель был изменен.*/
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
