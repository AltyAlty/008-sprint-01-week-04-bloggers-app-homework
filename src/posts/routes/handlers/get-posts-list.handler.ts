import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPaginatedPostsListOutputDTO } from '../../repositories/mappers/map-to-paginated-posts-list-output-dto.util';
import { matchedData } from 'express-validator';
import { GetPostsListQueryInputDTO } from '../input-dto/get-posts-list-query.input-dto';
import { applyDefaultPaginationSettings } from '../../../core/utils/pagination/apply-default-pagination-settings';
import { postsService } from '../../application/posts.service';

export const getPostsListHandler = async (req: Request<{}, {}, {}, GetPostsListQueryInputDTO>, res: Response) => {
  try {
    const sanitizedQueryInput = matchedData<GetPostsListQueryInputDTO>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const sanitizedQueryInputWithDefaultPaginationSettings = applyDefaultPaginationSettings(sanitizedQueryInput);
    const { items, totalCount } = await postsService.findMany(sanitizedQueryInputWithDefaultPaginationSettings);

    const paginatedPostsListOutput = mapToPaginatedPostsListOutputDTO(items, {
      pageNumber: sanitizedQueryInputWithDefaultPaginationSettings.pageNumber,
      pageSize: sanitizedQueryInputWithDefaultPaginationSettings.pageSize,
      totalCount,
    });

    res.send(paginatedPostsListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
