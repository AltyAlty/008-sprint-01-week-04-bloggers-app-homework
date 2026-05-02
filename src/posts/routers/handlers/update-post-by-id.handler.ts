import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { UpdatePostInputDTO } from '../input-dto/update-post.input-dto';
import { postsService } from '../../application/posts.service';

export const updatePostByIdHandler = async (req: Request<{ id: string }, {}, UpdatePostInputDTO>, res: Response) => {
  try {
    const postId = req.params.id;
    await postsService.updateById(postId, req.body);
    res.sendStatus(HttpStatus.NoContent_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
