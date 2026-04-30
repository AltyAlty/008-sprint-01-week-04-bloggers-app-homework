import { GetRidesListQueryInputDTO } from '../routers/input-dto/get-rides-list-query.input-dto';
import { Filter, ObjectId, WithId } from 'mongodb';
import { RideType } from '../types/ride.type';
import { ridesCollection } from '../../db/mongodb/mongo.db';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';

export const ridesQueryRepository = {
  async findMany(queryDTO: GetRidesListQueryInputDTO): Promise<{ items: WithId<RideType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDTO;
    const skip = (pageNumber - 1) * pageSize;
    const filter: Filter<RideType> = {};

    const [items, totalCount] = await Promise.all([
      ridesCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      ridesCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<RideType>> {
    const res = await ridesCollection.findOne({ _id: new ObjectId(id) });
    if (!res) throw new RepositoryNotFoundError('Ride does not exist');
    return res;
  },
};
