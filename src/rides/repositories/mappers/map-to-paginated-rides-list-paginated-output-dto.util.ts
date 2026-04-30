import { WithId } from 'mongodb';
import { ResourceType } from '../../../core/types/domain/resource-type';
import { RideType } from '../../types/ride.type';
import { PaginatedRidesListOutputDTO } from '../../routers/output-dto/paginated-rides-list.output-dto';

export const mapToPaginatedRidesListOutputDTO = (
  rides: WithId<RideType>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): PaginatedRidesListOutputDTO => {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },
    data: rides.map((ride) => ({
      type: ResourceType.Rides,
      id: ride._id.toString(),
      attributes: {
        clientName: ride.clientName,
        driver: ride.driver,
        vehicle: ride.vehicle,
        price: ride.price,
        currency: ride.currency,
        startedAt: ride.startedAt,
        finishedAt: ride.finishedAt,
        addresses: ride.addresses,
      },
    })),
  };
};
