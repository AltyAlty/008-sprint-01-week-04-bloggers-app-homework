import { Router, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { driversCollection, ridesCollection } from '../../db/mongodb/mongo.db';

/*Роутер из Express для тестирования приложения.*/
export const testingRouter = Router({});

/*Конфигурируем роутер "testingRouter".*/
testingRouter
  /*DELETE-запрос для очистки БД с данными по водителям для целей тестирования.*/
  .delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([ridesCollection.deleteMany(), driversCollection.deleteMany()]);
    res.sendStatus(HttpStatus.NoContent);
  });
