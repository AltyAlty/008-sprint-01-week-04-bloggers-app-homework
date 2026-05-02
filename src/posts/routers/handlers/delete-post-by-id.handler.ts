import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { postsService } from '../../application/posts.service';

export const deletePostByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id;
    await postsService.deleteById(postId);
    res.sendStatus(HttpStatus.NoContent_204);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
