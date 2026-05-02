import { Request, Response } from 'express';
import { mapToPostOutputDTO } from '../../repositories/mappers/map-to-post-output-dto.util';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { HttpStatus } from '../../../core/types/http-statuses';
import { postsService } from '../../application/posts.service';

export const getPostByIdHandler = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await postsService.findById(postId);
    const postOutput = mapToPostOutputDTO(post);
    res.status(HttpStatus.Ok_200).send(postOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
