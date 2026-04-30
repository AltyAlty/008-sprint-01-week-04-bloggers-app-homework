import { defaultPaginationSettingsType } from '../../../core/types/pagination/default-pagination-settings.type';
import { DriverSortFieldInputDTO } from './driver-sort-field.input-dto';

/*DTO для query-параметров при GET-запросе для получения данных по всем водителям.

Касательно TS:
1. "defaultPaginationSettingsType<DriverSortField>": обязательная часть типа.
2. "Partial<...>": дополнительные необязательные поля типа.*/
export type GetDriversListQueryInputDTO = defaultPaginationSettingsType<DriverSortFieldInputDTO> &
  Partial<{
    searchDriverNameTerm: string;
    searchDriverEmailTerm: string;
    searchVehicleMakeTerm: string;
  }>;
