import { PaginationMetaDataOutputDTO } from '../../../core/types/pagination/pagination-meta-data.output-dto';
import { RideOutputDTO } from './ride.output-dto';

export type PaginatedRidesListOutputDTO = {
  meta: PaginationMetaDataOutputDTO;
  data: RideOutputDTO[];
};
