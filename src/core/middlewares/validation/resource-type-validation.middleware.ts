import { body } from 'express-validator';
import { ResourceType } from '../../types/domain/resource-type';

/*Middleware "resourceTypeValidation" проверяет, что поле "type":
1. Является строкой.
2. Является типа "resourceType".*/
export const resourceTypeValidation = (resourceType: ResourceType) => {
  return body('data.type').isString().equals(resourceType).withMessage(`Resource type must be ${resourceType}`);
};
