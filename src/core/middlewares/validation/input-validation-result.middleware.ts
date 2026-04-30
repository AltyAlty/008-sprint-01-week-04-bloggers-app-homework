/*Импортируем функцию "validationResult()" из библиотеки express-validator для извлечения ошибок валидации из тела
запроса.*/
import { FieldValidationError, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { InternalValidationErrorType } from '../../types/validation/internal-validation-error.type';
import { HttpStatus } from '../../types/http-statuses';
import { ValidationErrorsListOutputDTO } from '../../types/validation/validation-errors-list.output-dto';

/*Функция "createErrorMessages()" формирует объект с сообщения об ошибках валидации, отправляемых клиенту.*/
export const createErrorMessages = (errors: InternalValidationErrorType[]): ValidationErrorsListOutputDTO => {
  return {
    errors: errors.map((error) => ({
      status: error.status,
      detail: error.detail,
      source: { pointer: error.source ?? '' },
      code: error.code ?? null,
    })),
  };
};

/*Функция "formInternalValidationError()" форматирует валидационные ошибки из библиотеки express-validator во внутренний
формат приложения.*/
const formInternalValidationError = (error: ValidationError): InternalValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    status: HttpStatus.BadRequest,
    detail: expressError.msg,
    source: expressError.path,
  };
};

/*Middleware "inputValidationResultMiddleware" формирует ответ клиенту об ошибках валидации.*/
export const inputValidationResultMiddleware = (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
  /*Если валидация при помощи библиотеки express-validator обнаруживает ошибки валидации, то информация об этих ошибках
  добавляется в объект запроса. Поэтому пытаемся здесь извлечь такие ошибки. Далее форматируем ошибки валидации при
  помощи функции "formInternalValidationError()". Затем возвращаем массив, где для каждого поля оставляется только
  первая ошибка.*/
  const errors = validationResult(req).formatWith(formInternalValidationError).array({ onlyFirstError: true });

  /*Если ошибки валидации были найдены, то сообщаем об этом клиенту.*/
  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
    return;
  }
  /*Если ошибок валидации не было найдено, то передаем управление следующему обработчику.*/
  next();
};
