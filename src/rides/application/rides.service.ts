import { ridesRepository } from '../repositories/rides.repository';
import { DomainError } from '../../core/errors/domain.error';
import { DriverErrorCode } from '../../drivers/application/drivers.service';
import { WithId } from 'mongodb';
import { GetRidesListQueryInputDTO } from '../routers/input-dto/get-rides-list-query.input-dto';
import { RideType } from '../types/ride.type';
import { CreateRideAttributesInputDTO } from './dto/create-ride-attributes.input-dto';
import { driversQueryRepository } from '../../drivers/repositories/drivers.query-repository';
import { ridesQueryRepository } from '../repositories/rides.query-repository';

export enum RideErrorCode {
  AlreadyFinished = 'RIDE_ALREADY_FINISHED',
}

export const ridesService = {
  async create(dto: CreateRideAttributesInputDTO): Promise<string> {
    const driver = await driversQueryRepository.findById(dto.driverId);
    const activeRide = await ridesRepository.findActiveRideByDriverId(dto.driverId);
    if (activeRide) throw new DomainError(`Driver is currently on a trip`, DriverErrorCode.HasActiveRide);

    const newRide: RideType = {
      clientName: dto.clientName,
      driver: {
        id: dto.driverId,
        name: driver.name,
      },
      vehicle: {
        licensePlate: driver.vehicle.licensePlate,
        name: `${driver.vehicle.make} ${driver.vehicle.model}`,
      },
      price: dto.price,
      currency: dto.currency,
      createdAt: new Date(),
      updatedAt: new Date(),
      startedAt: new Date(),
      finishedAt: null,
      addresses: {
        from: dto.fromAddress,
        to: dto.toAddress,
      },
    };

    return await ridesRepository.createRide(newRide);
  },

  async findRidesByDriver(
    queryDto: GetRidesListQueryInputDTO,
    driverId: string,
  ): Promise<{ items: WithId<RideType>[]; totalCount: number }> {
    await driversQueryRepository.findById(driverId);
    return ridesRepository.findRidesByDriver(queryDto, driverId);
  },

  async finishRide(id: string) {
    const ride = await ridesQueryRepository.findById(id);

    if (ride.finishedAt) {
      throw new DomainError(`Ride was already finished at ${ride.finishedAt}`, RideErrorCode.AlreadyFinished);
    }

    await ridesRepository.finishRide(id, new Date());
  },
};
