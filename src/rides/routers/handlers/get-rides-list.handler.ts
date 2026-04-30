import { Request, Response } from 'express';
import { errorsHandler } from '../../../core/errors/errors.handler';
import { mapToPaginatedRidesListOutputDTO } from '../../repositories/mappers/map-to-paginated-rides-list-paginated-output-dto.util';
import { matchedData } from 'express-validator';
import { GetRidesListQueryInputDTO } from '../input-dto/get-rides-list-query.input-dto';
import { ridesQueryRepository } from '../../repositories/rides.query-repository';
import { applyDefaultPaginationSettings } from '../../../core/utils/pagination/apply-default-pagination-settings ';

export const getRidesListHandler = async (req: Request<{}, {}, {}, GetRidesListQueryInputDTO>, res: Response) => {
  try {
    const sanitizedQueryInput = matchedData<GetRidesListQueryInputDTO>(req, {
      locations: ['query'],
      includeOptionals: true,
    });

    const sanitizedQueryInputWithDefaultPaginationSettings = applyDefaultPaginationSettings(sanitizedQueryInput);
    const { items, totalCount } = await ridesQueryRepository.findMany(sanitizedQueryInputWithDefaultPaginationSettings);

    const paginatedRidesListOutput = mapToPaginatedRidesListOutputDTO(items, {
      pageNumber: sanitizedQueryInputWithDefaultPaginationSettings.pageNumber,
      pageSize: sanitizedQueryInputWithDefaultPaginationSettings.pageSize,
      totalCount,
    });

    res.send(paginatedRidesListOutput);
  } catch (error: unknown) {
    errorsHandler(error, res);
  }
};
