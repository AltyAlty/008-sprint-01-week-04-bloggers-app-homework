import express, { Express, Request, Response } from 'express';
import { HttpStatus } from './core/types/http-statuses';
import { setupSwagger } from './core/swagger/setup-swagger';
import { SETTINGS } from './core/settings/settings';
import { blogsRouter } from './blogs/routes/blogs.router';
import { postsRouter } from './posts/routes/posts.router';
import { testingRouter } from './testing/routes/testing.router';

/*Функция "setupApp()" для конфигурирования экземпляров приложения Express.*/
export const setupApp = async (app: Express) => {
  /*Подключаем middleware для парсинга JSON в теле запроса.*/
  app.use(express.json());
  /*GET-запрос для получения главной страницы.*/
  app.get('/', (req: Request, res: Response) => res.status(HttpStatus.Ok_200).send('Hello World!'));
  /*Подключаем роутеры.*/
  app.use(SETTINGS.BLOGS_PATH, blogsRouter);
  app.use(SETTINGS.POSTS_PATH, postsRouter);
  app.use(SETTINGS.TESTING_PATH, testingRouter);
  /*Инициализируем документацию Swagger.*/
  setupSwagger(app);
  return app;
};
