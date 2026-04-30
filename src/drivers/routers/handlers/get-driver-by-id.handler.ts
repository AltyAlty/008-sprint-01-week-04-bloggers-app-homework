import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToWrappedDriverOutputDTO } from '../../repositories/mappers/map-to-wrapped-driver-output-dto.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { driversQueryRepository } from '../../repositories/drivers.query-repository';

/*"Request" из Express используется для типизации параметра "req", а "Response" из Express используется для типизации
параметра "res".

Типизация первого параметра "req" второго параметра в виде асинхронной функции методов "get()", "post()", "delete()" и
"put()" внутри роутеров из Express:
1. На первом месте в типе идут URI-параметры.
2. На втором месте в типе идет "ResBody". Относится к параметру "res" внутри запроса, то есть что будет возвращено.
3. На третьем месте в типе идет "ReqBody". Это то, что приходит в body в запросе.
4. На четвертом месте в типе идут Query-параметры.

Функция-обработчик "getDriverByIdHandler()" для GET-запросов для поиска водителя по ID при помощи URI-параметров.*/
export const getDriverByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    /*Просим query-репозиторий "driversQueryRepository" найти данные по водителю по ID в БД.*/
    const driver = await driversQueryRepository.findById(id);
    /*Преобразовываем данные по водителю из БД в подготовленные для отправки клиенту данные по водителю.*/
    const driverOutput = mapToWrappedDriverOutputDTO(driver);
    /*Отправляем преобразованные для отправки данные клиенту.*/
    res.status(HttpStatus.Ok).send(driverOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
