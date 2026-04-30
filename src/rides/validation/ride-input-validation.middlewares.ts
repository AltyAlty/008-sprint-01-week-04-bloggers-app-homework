import { body } from 'express-validator';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type-validation.middleware';
import { ResourceType } from '../../core/types/domain/resource-type';
import { Currency } from '../types/currency.type';

export const clientNameValidation = body('data.attributes.clientName')
  .isString()
  .withMessage('status should be a string')
  .trim()
  .isLength({ min: 3, max: 100 });

export const driverIdValidation = body('data.attributes.driverId')
  .isString()
  .withMessage('ID must be a string')
  .trim()
  .isMongoId()
  .withMessage('Incorrect format of ObjectId');

export const priceValidation = body('data.attributes.price')
  /*Проверяем, что поле "price" является числом большим 0.*/
  .isFloat({ gt: 0 })
  .withMessage('price must be a positive number');

export const currencyValidation = body('data.attributes.currency')
  .isString()
  .withMessage('currency should be a string')
  .trim()
  .isIn(Object.values(Currency))
  .withMessage('currency must be either "usd" or "eu"');

export const startAddressValidation = body('data.attributes.fromAddress')
  .isString()
  .withMessage('startAddress should be a string')
  .trim()
  .isLength({ min: 10, max: 200 });

export const endAddressValidation = body('data.attributes.toAddress')
  .isString()
  .withMessage('endAddress should be a string')
  .trim()
  .isLength({ min: 10, max: 200 });

export const rideCreateInputValidation = [
  resourceTypeValidation(ResourceType.Rides),
  clientNameValidation,
  driverIdValidation,
  priceValidation,
  currencyValidation,
  startAddressValidation,
  endAddressValidation,
];
