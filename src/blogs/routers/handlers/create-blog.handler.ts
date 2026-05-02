import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { blogsService } from '../../application/blogs.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToBlogOutputDTO } from '../../repositories/mappers/map-to-blog-output-dto.util';
import { CreateBlogInputDTO } from '../input-dto/create-blog.input-dto';

/*Функция-обработчик "createBlogHandler()" для POST-запросов для добавления нового блога.*/
export const createBlogHandler = async (req: Request<{}, {}, CreateBlogInputDTO>, res: Response) => {
  try {
    /*Просим сервис "blogsService" создать новый блог.*/
    const createdBlogId = await blogsService.create(req.body);
    /*Просим сервис "blogsService" найти данные по созданному блогу по ID в БД.*/
    const createdBlog = await blogsService.findById(createdBlogId);
    /*Преобразовываем данные по блогу из БД в подготовленные для отправки клиенту данные. Знак "!" означает, что мы
    гарантируем "createdBlog" не null или undefined в этом месте.*/
    const blogOutput = mapToBlogOutputDTO(createdBlog!);
    /*Отправляем преобразованные для отправки данные клиенту.*/
    res.status(HttpStatus.Created_201).send(blogOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
