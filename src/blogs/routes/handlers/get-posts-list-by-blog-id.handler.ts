import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { matchedData } from 'express-validator';
import { applyDefaultPaginationSettings } from '../../../core/utils/pagination/apply-default-pagination-settings';
import { mapToPaginatedPostsListOutputDTO } from '../../../posts/repositories/mappers/map-to-paginated-posts-list-output-dto.util';
import { postsService } from '../../../posts/application/posts.service';
import { GetPostsListInExistingBlogQueryInputDTO } from '../../../posts/routes/input-dto/get-posts-list-in-existing-blog-query.input-dto';

/*Функция-обработчик "getPostsListByBlogIdHandler()" для GET-запросов для получения данных по всем постам в существующем
блоге по ID с пагинацией при помощи URI-параметров.*/
export const getPostsListByBlogIdHandler = async (
  req: Request<{ blogId: string }, {}, {}, GetPostsListInExistingBlogQueryInputDTO>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;

    /*Функция "matchedData()" из библиотеки express-validator берет из объекта "req" только те поля, которые ранее
    прошли через валидаторы и санитайзеры на основе библиотеки express-validator.*/
    const sanitizedQueryInput = matchedData<GetPostsListInExistingBlogQueryInputDTO>(req, {
      /*Берем данные только из объекта "req.query".*/
      locations: ['query'],
      /*Включить опциональные поля, то есть те, для которых в валидаторах использовался метод "optional()", даже если
      они не пришли в запросе или были пропущены.*/
      includeOptionals: true,
    });

    /*Добавляем к объекту с query-параметрами поля, чтобы этот объект соответствовал типу
    "defaultPaginationSettingsType".*/
    const sanitizedQueryInputWithDefaultPaginationSettings = applyDefaultPaginationSettings(sanitizedQueryInput);

    /*Просим сервис "postsService" найти данные по постам в существующем блоге по ID.*/
    const { items, totalCount } = await postsService.findManyByBlogId(
      blogId,
      sanitizedQueryInputWithDefaultPaginationSettings,
    );

    /*Преобразовываем данные по постам из БД в подготовленные для пагинации данные.*/
    const paginatedPostsListOutput = mapToPaginatedPostsListOutputDTO(items, {
      pageNumber: sanitizedQueryInputWithDefaultPaginationSettings.pageNumber,
      pageSize: sanitizedQueryInputWithDefaultPaginationSettings.pageSize,
      totalCount,
    });

    /*Отправляем преобразованные для пагинации данные по блогам клиенту.*/
    res.send(paginatedPostsListOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
