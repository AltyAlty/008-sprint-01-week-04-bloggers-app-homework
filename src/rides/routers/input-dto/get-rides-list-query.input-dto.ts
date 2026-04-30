import { defaultPaginationSettingsType } from '../../../core/types/pagination/default-pagination-settings.type';
import { RideSortFieldInputDTO } from './ride-sort-field.input-dto';

export type GetRidesListQueryInputDTO = defaultPaginationSettingsType<RideSortFieldInputDTO>;
