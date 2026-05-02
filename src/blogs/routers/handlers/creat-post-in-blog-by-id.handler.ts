import { Request, Response } from 'express';
import { CreatePostInExistingBlogInputDTO } from '../../../posts/routers/input-dto/create-post-in-existing-blog.input-dto';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../../posts/application/posts.service';
import { mapToPostOutputDTO } from '../../../posts/repositories/mappers/map-to-post-output-dto.util';
import { errorsHandler } from '../../../core/errors/errors.handler';

/*Функция-обработчик "createPostInExistingBlogByIdHandler()" для POST-запросов для добавления нового постав в
существующий блог по ID при помощи URI-параметров.*/
export const createPostInExistingBlogByIdHandler = async (
  req: Request<{ blogId: string }, {}, CreatePostInExistingBlogInputDTO>,
  res: Response,
) => {
  try {
    const blogId = req.params.blogId;
    /*Просим сервис "postsService" создать пост в существующем блоге.*/
    const createdPostId = await postsService.createInExistingBlog(blogId, req.body);
    /*Просим сервис "postsService" найти созданный пост по ID.*/
    const createdPost = await postsService.findById(createdPostId);
    /*Преобразовываем данные по посту из БД в подготовленные для отправки клиенту данные.*/
    const postOutput = mapToPostOutputDTO(createdPost);
    /*Отправляем преобразованные для отправки данные клиенту.*/
    res.status(HttpStatus.Created_201).send(postOutput);
  } catch (error: unknown) {
    /*Если была перехвачена ошибка, то обрабатываем ее.*/
    errorsHandler(error, res);
  }
};
