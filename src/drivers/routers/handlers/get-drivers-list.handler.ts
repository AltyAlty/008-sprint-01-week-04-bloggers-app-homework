import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPaginatedDriversListOutputDTO } from '../../repositories/mappers/map-to-paginated-drivers-list-output-dto.util';
import { matchedData } from 'express-validator';
import { GetDriversListQueryInputDTO } from '../input-dto/get-drivers-list-query.input-dto';
import { driversQueryRepository } from '../../repositories/drivers.query-repository';
import { applyDefaultPaginationSettings } from '../../../core/utils/pagination/apply-default-pagination-settings ';

/*Функция-обработчик "getDriversListHandler()" для GET-запросов для получения данных по всем водителям при помощи
query-параметров.*/
export const getDriversListHandler = async (req: Request<{}, {}, {}, GetDriversListQueryInputDTO>, res: Response) => {
  try {
    /*Функция "matchedData()" из библиотеки express-validator берет из объекта "req" только те поля, которые ранее
    прошли через валидаторы и санитайзеры на основе библиотеки express-validator.*/
    const sanitizedQueryInput = matchedData<GetDriversListQueryInputDTO>(req, {
      /*Берем данные только из объекта "req.query".*/
      locations: ['query'],
      /*Включить опциональные поля, то есть те, для которых в валидаторах использовался метод "optional()", даже если
      они не пришли в запросе или были пропущены.*/
      includeOptionals: true,
    });

    /*Добавляем к объекту с query-параметрами поля, чтобы этот объект соответствовал типу
    "defaultPaginationSettingsType".*/
    const sanitizedQueryInputWithDefaultPaginationSettings = applyDefaultPaginationSettings(sanitizedQueryInput);
    /*Просим query-репозиторий "driversQueryRepository" найти данные по водителям.*/
    const { items, totalCount } = await driversQueryRepository.findMany(
      sanitizedQueryInputWithDefaultPaginationSettings,
    );

    /*Преобразовываем данные по водителям из БД в подготовленные для пагинации данные по водителям.*/
    const paginatedDriversListOutput = mapToPaginatedDriversListOutputDTO(items, {
      pageNumber: sanitizedQueryInputWithDefaultPaginationSettings.pageNumber,
      pageSize: sanitizedQueryInputWithDefaultPaginationSettings.pageSize,
      totalCount,
    });

    /*Отправляем преобразованные для пагинации данные по водителям клиенту.*/
    res.send(paginatedDriversListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
