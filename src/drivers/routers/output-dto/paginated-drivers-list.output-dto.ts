import { DriverOutputDTO } from './driver.output-dto';
import { PaginationMetaDataOutputDTO } from '../../../core/types/pagination/pagination-meta-data.output-dto';

/*DTO ответа со списком водителей для пагинации: содержит метаданные пагинации и массив элементов водителей.*/
export type PaginatedDriversListOutputDTO = {
  meta: PaginationMetaDataOutputDTO;
  data: DriverOutputDTO[];
};
