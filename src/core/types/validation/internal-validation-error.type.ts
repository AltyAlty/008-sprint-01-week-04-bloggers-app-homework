import { HttpStatus } from '../http-statuses';

/*Тип для внутреннего представления сообщения об ошибке валидации при использовании библиотеки express-validator.*/
export type InternalValidationErrorType = {
  status: HttpStatus;
  detail: string;
  source?: string;
  code?: string;
};
