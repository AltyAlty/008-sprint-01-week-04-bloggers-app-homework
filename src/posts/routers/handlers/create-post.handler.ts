import { Request, Response } from 'express';
import { HttpStatus } from '../../../core/types/http-statuses';
import { mapToPostOutputDTO } from '../../repositories/mappers/map-to-post-output-dto.util';
import { postsService } from '../../application/posts.service';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { CreatePostInputDTO } from '../input-dto/create-post.input-dto';

export const createPostHandler = async (req: Request<{}, {}, CreatePostInputDTO>, res: Response) => {
  try {
    const createdPostId = await postsService.create(req.body);
    const createdPost = await postsService.findById(createdPostId);
    const postOutput = mapToPostOutputDTO(createdPost);
    res.status(HttpStatus.Created_201).send(postOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
