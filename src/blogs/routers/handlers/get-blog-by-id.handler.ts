import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToBlogOutputDTO } from '../../repositories/mappers/map-to-blog-output-dto.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { blogsService } from '../../application/blogs.service';

/*"Request" из Express используется для типизации параметра "req", а "Response" из Express используется для типизации
параметра "res".

Типизация первого параметра "req" второго параметра в виде асинхронной функции методов "get()", "post()", "delete()" и
"put()" внутри роутеров из Express:
1. На первом месте в типе идут URI-параметры.
2. На втором месте в типе идет "ResBody". Относится к параметру "res" внутри запроса, то есть что будет возвращено.
3. На третьем месте в типе идет "ReqBody". Это то, что приходит в body в запросе.
4. На четвертом месте в типе идут Query-параметры.

Функция-обработчик "getBlogByIdHandler()" для GET-запросов для поиска блога по ID при помощи URI-параметров.*/
export const getBlogByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    /*Просим сервис "blogsService" найти данные по блогу по ID.*/
    const blog = await blogsService.findById(id);
    /*Преобразовываем данные по блогу из БД в подготовленные для отправки клиенту данные.*/
    const blogOutput = mapToBlogOutputDTO(blog);
    /*Отправляем преобразованные для отправки данные клиенту.*/
    res.status(HttpStatus.Ok_200).send(blogOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
