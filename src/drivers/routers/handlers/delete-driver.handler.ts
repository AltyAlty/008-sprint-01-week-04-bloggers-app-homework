import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { driversService } from '../../application/drivers.service';

/*Функцию-обработчик "deleteDriverHandler()" для DELETE-запросов для удаления водителя по ID при помощи
URI-параметров.*/
export const deleteDriverHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    /*Просим сервис "driversService" удалить водителя по ID.*/
    await driversService.delete(id);
    /*Сообщаем клиенту, что водитель был удален.*/
    res.sendStatus(HttpStatus.NoContent);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
