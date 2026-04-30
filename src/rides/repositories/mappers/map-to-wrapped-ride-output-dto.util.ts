import { WithId } from 'mongodb';
import { ResourceType } from '../../../core/types/domain/resource-type';
import { WrappedRideOutputDTO } from '../../routers/output-dto/wrapped-ride.output-dto';
import { RideType } from '../../types/ride.type';

export const mapToWrappedRideOutputDTO = (ride: WithId<RideType>): WrappedRideOutputDTO => {
  return {
    data: {
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
    },
  };
};
