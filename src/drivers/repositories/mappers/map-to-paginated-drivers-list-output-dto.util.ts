import { WithId } from 'mongodb';
import { ResourceType } from '../../../core/types/domain/resource-type';
import { DriverType } from '../../types/driver.type';
import { PaginatedDriversListOutputDTO } from '../../routers/output-dto/paginated-drivers-list.output-dto';
import { DriverOutputDTO } from '../../routers/output-dto/driver.output-dto';

/*Функция "mapToPaginatedDriversListOutputDTO()" преобразовывает данные по водителям из БД в подготовленные для пагинации
данные по водителям.*/
export const mapToPaginatedDriversListOutputDTO = (
  drivers: WithId<DriverType>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PaginatedDriversListOutputDTO => {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: drivers.map(
      (driver): DriverOutputDTO => ({
        type: ResourceType.Drivers,
        id: driver._id.toString(),
        attributes: {
          name: driver.name,
          phoneNumber: driver.phoneNumber,
          email: driver.email,
          vehicle: driver.vehicle,
          createdAt: driver.createdAt,
        },
      }),
    ),
  };
};
