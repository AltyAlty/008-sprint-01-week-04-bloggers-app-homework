import { ResourceType } from '../../../core/types/domain/resource-type';
import { CreateRideAttributesInputDTO } from '../../application/dto/create-ride-attributes.input-dto';

export type CreateRideDataInputDTO = {
  data: {
    type: ResourceType.Rides;
    attributes: CreateRideAttributesInputDTO;
  };
};
