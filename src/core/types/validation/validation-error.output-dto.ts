import { HttpStatus } from '../http-statuses';

/*DTO для сообщений об ошибках валидации, отправляемых клиенту.*/
export type ValidationErrorOutputDTO = {
  status: HttpStatus;
  /*Текст ошибки.*/
  detail: string;
  /*Где именно ошибка во входных данных. Свойство "pointer" указывает на проблемное поле.*/
  source: { pointer: string };
  /*Доменный код ошибки.*/
  code: string | null;
};
