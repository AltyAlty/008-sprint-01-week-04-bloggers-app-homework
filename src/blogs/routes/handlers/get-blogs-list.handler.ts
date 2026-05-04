import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPaginatedBlogsListOutputDTO } from '../../repositories/mappers/map-to-paginated-blogs-list-output-dto.util';
import { matchedData } from 'express-validator';
import { GetBlogsListQueryInputDTO } from '../input-dto/get-blogs-list-query.input-dto';
import { applyDefaultPaginationSettings } from '../../../core/utils/pagination/apply-default-pagination-settings';
import { blogsService } from '../../application/blogs.service';

/*Функция-обработчик "getBlogsListHandler()" для GET-запросов для получения данных по всем блогам при помощи
query-параметров.*/
export const getBlogsListHandler = async (req: Request<{}, {}, {}, GetBlogsListQueryInputDTO>, res: Response) => {
  try {
    /*Функция "matchedData()" из библиотеки express-validator берет из объекта "req" только те поля, которые ранее
    прошли через валидаторы и санитайзеры на основе библиотеки express-validator.*/
    const sanitizedQueryInput = matchedData<GetBlogsListQueryInputDTO>(req, {
      /*Берем данные только из объекта "req.query".*/
      locations: ['query'],
      /*Включить опциональные поля, то есть те, для которых в валидаторах использовался метод "optional()", даже если
      они не пришли в запросе или были пропущены.*/
      includeOptionals: true,
    });

    /*Добавляем к объекту с query-параметрами поля, чтобы этот объект соответствовал типу
    "defaultPaginationSettingsType".*/
    const sanitizedQueryInputWithDefaultPaginationSettings = applyDefaultPaginationSettings(sanitizedQueryInput);
    // const sanitizedQueryInputWithDefaultPaginationSettings = applyDefaultPaginationSettings(req.query);
    /*Просим сервис "blogsService" найти данные по блогам.*/
    const { items, totalCount } = await blogsService.findMany(sanitizedQueryInputWithDefaultPaginationSettings);

    /*Преобразовываем данные по блогам из БД в подготовленные для пагинации данные.*/
    const paginatedBlogsListOutput = mapToPaginatedBlogsListOutputDTO(items, {
      pageNumber: sanitizedQueryInputWithDefaultPaginationSettings.pageNumber,
      pageSize: sanitizedQueryInputWithDefaultPaginationSettings.pageSize,
      totalCount,
    });

    /*Отправляем преобразованные для пагинации данные по блогам клиенту.*/
    res.send(paginatedBlogsListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
