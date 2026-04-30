import express, { Express, Request, Response } from 'express';
import { driversRouter } from './drivers/routers/drivers.router';
import { testingRouter } from './testing/routers/testing.router';
import { HttpStatus } from './core/types/http-statuses';
import { setupSwagger } from './core/swagger/setup-swagger';
import { ridesRouter } from './rides/routers/rides.router';
import { SETTINGS } from './core/settings/settings';

/*Функция "setupApp()" для конфигурирования экземпляров приложения Express.*/
export const setupApp = async (app: Express) => {
  /*Подключаем middleware для парсинга JSON в теле запроса.*/
  app.use(express.json());
  /*GET-запрос для получения главной страницы.*/
  app.get('/', (req: Request, res: Response) => res.status(HttpStatus.Ok).send('Hello World!'));
  /*Подключаем роутеры.*/
  app.use(SETTINGS.DRIVERS_PATH, driversRouter);
  app.use(SETTINGS.TESTING_PATH, testingRouter);
  app.use(SETTINGS.RIDES_PATH, ridesRouter);
  /*Инициализируем документацию Swagger.*/
  setupSwagger(app);
  return app;
};
