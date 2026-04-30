/*Импортируем метод "param()" из библиотеки express-validator, чтобы проверять ID.*/
import { body, param } from 'express-validator';

/*Middleware "idValidation" проверяет, что ID:
1. Существует в запросе.
2. Является строкой.
3. Не является пустым.
4. Является типа ObjectId.*/
export const idValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .isString()
  .withMessage('ID must be a string')
  .isLength({ min: 1 })
  .withMessage('ID must not be empty')
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');

/*Middleware "dataIdMatchValidation" при обработке запроса на изменение сущности проверяет, что:
1. В теле запроса есть ID.
2. ID в теле запроса совпадает с ID из URI-параметров.*/
export const dataIdMatchValidation = body('data.id')
  .exists()
  .withMessage('ID in body is required')
  /*Библиотека express-validator сделает так, что параметр "value" будет равен тому, что находится в свойстве
  "data.id".*/
  .custom((value, { req }) => {
    if (value !== req?.params?.id) throw new Error('ID in URL and ID in body must match');
    /*Если валидация прошла успешно, то возвращаем true.*/
    return true;
  });
