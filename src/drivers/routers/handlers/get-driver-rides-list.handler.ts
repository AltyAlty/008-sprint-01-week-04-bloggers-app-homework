import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { ridesService } from '../../../rides/application/rides.service';
import { mapToPaginatedRidesListOutputDTO } from '../../../rides/repositories/mappers/map-to-paginated-rides-list-paginated-output-dto.util';
import { GetRidesListQueryInputDTO } from '../../../rides/routers/input-dto/get-rides-list-query.input-dto';

/*Функция-обработчик "getDriverRidesListHandler()" для GET-запросов для получения данных по всем поездкам водителя при
помощи URI-параметров и query-параметров.*/
export const getDriverRidesListHandler = async (
  req: Request<{ id: string }, {}, {}, GetRidesListQueryInputDTO>,
  res: Response,
) => {
  try {
    const driverId = req.params.id;
    const queryInput = req.query;

    /*Просим сервис "ridesService" найти данные по всем поездкам водителя.*/
    const { items, totalCount } = await ridesService.findRidesByDriver(queryInput, driverId);

    /*Преобразовываем данные по всем поездкам водителя из БД в подготовленные для пагинации данные по всем поездкам
    водителя.*/
    const paginatedRidesListOutput = mapToPaginatedRidesListOutputDTO(items, {
      pageNumber: queryInput.pageNumber,
      pageSize: queryInput.pageSize,
      totalCount,
    });

    /*Отправляем преобразованные для пагинации данные по всем поездкам водителя клиенту.*/
    res.send(paginatedRidesListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
