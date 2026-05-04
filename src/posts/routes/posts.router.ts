import { Router } from 'express';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard-middleware';
import { idValidation } from '../../core/middlewares/validation/params-id-validation.middlewares';
import { postCreateInputValidation, postUpdateInputValidation } from '../validation/post-input-validation.middlewares';
import { createPostHandler } from './handlers/create-post.handler';
import { getPostsListHandler } from './handlers/get-posts-list.handler';
import { getPostByIdHandler } from './handlers/get-post-by-id.handler';
import { updatePostByIdHandler } from './handlers/update-post-by-id.handler';
import { paginationValidationMiddleware } from '../../core/middlewares/validation/pagination-validation.middleware';
import { PostSortFieldInputDTO } from './input-dto/post-sort-field.input-dto';
import { deletePostByIdHandler } from './handlers/delete-post-by-id.handler';

export const postsRouter = Router({});

postsRouter
  .get('', paginationValidationMiddleware(PostSortFieldInputDTO), inputValidationResultMiddleware, getPostsListHandler)
  .post('', superAdminGuardMiddleware, postCreateInputValidation, inputValidationResultMiddleware, createPostHandler)
  .get('/:id', idValidation, inputValidationResultMiddleware, getPostByIdHandler)
  .put(
    '/:id',
    superAdminGuardMiddleware,
    idValidation,
    postUpdateInputValidation,
    inputValidationResultMiddleware,
    updatePostByIdHandler,
  )
  .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deletePostByIdHandler);
