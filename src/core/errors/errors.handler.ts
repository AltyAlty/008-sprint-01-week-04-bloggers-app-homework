import { Response } from 'express';
import { RepositoryNotFoundError } from './repository-not-found.error';
import { HttpStatus } from '../types/http-statuses';
import { DomainError } from './domain.error';
import { createErrorMessages } from '../middlewares/validation/input-validation-result.middleware';

/*Функция "errorsHandler()" занимается перехватом ошибок в UI слое.*/
export const errorsHandler = (error: unknown, res: Response): void => {
  /*Если перехваченная ошибка является ошибкой, когда сущность не была найдена в репозитории, то сообщаем об этом
  клиенту.*/
  if (error instanceof RepositoryNotFoundError) {
    const httpStatus = HttpStatus.NotFound;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          detail: error.message,
        },
      ]),
    );

    return;
  }

  /*Если же перехваченная ошибка является ошибкой, когда к сущности нельзя применить какую-то операцию в BLL, то
  сообщаем об этом клиенту.*/
  if (error instanceof DomainError) {
    const httpStatus = HttpStatus.UnprocessableEntity;

    res.status(httpStatus).send(
      createErrorMessages([
        {
          status: httpStatus,
          source: error.source,
          detail: error.message,
          code: error.code,
        },
      ]),
    );

    return;
  }

  /*Если же перехваченная ошибка является ошибкой какого-то другого типа, то сообщаем об этом клиенту.*/
  res.status(HttpStatus.InternalServerError);
  return;
};
