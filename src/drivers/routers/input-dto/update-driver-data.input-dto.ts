import { ResourceType } from '../../../core/types/domain/resource-type';
import { CreateDriverAttributesInputDTO } from '../../application/dto/create-driver-attributes.input-dto';

/*DTO для свойства "data" в теле запросов на изменения водителя.*/
export type UpdateDriverDataInputDTO = {
  data: {
    type: ResourceType.Drivers;
    id: string;
    attributes: CreateDriverAttributesInputDTO;
  };
};
