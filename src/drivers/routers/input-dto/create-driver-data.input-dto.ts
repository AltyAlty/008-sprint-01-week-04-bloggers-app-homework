import { ResourceType } from '../../../core/types/domain/resource-type';
import { CreateDriverAttributesInputDTO } from '../../application/dto/create-driver-attributes.input-dto';

/*DTO для свойства "data" в теле запросов на создание нового водителя.*/
export type CreateDriverDataInputDTO = {
  data: {
    type: ResourceType.Drivers;
    attributes: CreateDriverAttributesInputDTO;
  };
};
