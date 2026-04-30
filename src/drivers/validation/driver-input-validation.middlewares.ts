/*Импортируем метод "body()" из библиотеки express-validator, чтобы проверять тело запроса.*/
import { body } from 'express-validator';
import { resourceTypeValidation } from '../../core/middlewares/validation/resource-type-validation.middleware';
import { ResourceType } from '../../core/types/domain/resource-type';
import { VehicleFeature } from '../types/vehicle-features.type';
import { dataIdMatchValidation } from '../../core/middlewares/validation/params-id-validation.middlewares';

/*Middleware "nameValidation" проверяет, что поле "name":
1. Является строкой.
2. Состоит из не менее 2 и не более 15 символов.*/
const nameValidation = body('data.attributes.name')
  .isString()
  .withMessage('name should be a string')
  .trim()
  .isLength({ min: 2, max: 15 })
  .withMessage('name is too short or too long');

/*Middleware "phoneNumberValidation" проверяет, что поле "phoneNumber":
1. Является строкой.
2. Состоит из не менее 8 и не более 15 символов.*/
const phoneNumberValidation = body('data.attributes.phoneNumber')
  .isString()
  .withMessage('phoneNumber should be a string')
  .trim()
  .isLength({ min: 8, max: 15 })
  .withMessage('phoneNumber is too short or too long');

/*Middleware "emailValidation" проверяет, что поле "email":
1. Является строкой.
2. Состоит из не менее 5 и не более 100 символов.*/
const emailValidation = body('data.attributes.email')
  .isString()
  .withMessage('email should be a string')
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage('email is too short or too long')
  .isEmail();

/*Middleware "vehicleMakeValidation" проверяет, что поле "vehicleMake":
1. Является строкой.
2. Состоит из не менее 3 и не более 100 символов.*/
const vehicleMakeValidation = body('data.attributes.vehicleMake')
  .isString()
  .withMessage('vehicleMake should be a string')
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('vehicleMake is too short or too long');

/*Middleware "vehicleModelValidation" проверяет, что поле "vehicleModel":
1. Является строкой.
2. Состоит из не менее 2 и не более 100 символов.*/
const vehicleModelValidation = body('data.attributes.vehicleModel')
  .isString()
  .withMessage('vehicleModel should be a string')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('vehicleModel is too short or too long');

/*Получаем текущий год.*/
const currentYear = new Date().getFullYear();

/*Middleware "vehicleYearValidation" проверяет, что поле "vehicleYear" содержит в виде числа год не ранее 1980 года и не
позднее текущего года.*/
const vehicleYearValidation = body('data.attributes.vehicleYear')
  .isInt({ min: 1980, max: currentYear })
  .withMessage('vehicleModel should be a real year');

/*Middleware "vehicleLicensePlateValidation" проверяет, что поле "vehicleLicensePlate":
1. Является строкой.
2. Состоит из не менее 6 и не более 10 символов.*/
const vehicleLicensePlateValidation = body('data.attributes.vehicleLicensePlate')
  .isString()
  .withMessage('vehicleLicensePlate should be a string')
  .trim()
  .isLength({ min: 6, max: 10 })
  .withMessage('vehicleLicensePlate is too short or too long');

/*Middleware "vehicleDescriptionValidation" проверяет, что поле "vehicleLicensePlate":
1. Может быть null.
2. Является строкой.
3. Состоит из не менее 10 и не более 200 символов.*/
const vehicleDescriptionValidation = body('data.attributes.vehicleDescription')
  .optional({ nullable: true })
  .isString()
  .withMessage('vehicleDescription should be a string')
  .trim()
  .isLength({ min: 10, max: 200 })
  .withMessage('vehicleDescription is too short or too long');

/*Middleware "vehicleFeaturesValidation" проверяет, что поле "vehicleFeatures":
1. Является массивом.
2. Может быть пустым массивом.
3. Должен содержать значения типа "VehicleFeature".*/
const vehicleFeaturesValidation = body('data.attributes.vehicleFeatures')
  .isArray()
  .withMessage('vehicleFeatures should be an array')
  .optional()
  .custom((vehicleFeatures: Array<VehicleFeature>) => {
    if (vehicleFeatures.length) {
      const validFeatures = Object.values(VehicleFeature);

      vehicleFeatures.forEach((feature) => {
        if (!validFeatures.includes(feature)) {
          throw new Error('vehicleFeatures should contain values of VehicleFeature');
        }
      });
    }
    return true;
  });

/*Комбинируем вышеуказанные middlewares в один middleware "driverCreateInputValidation", чтобы использовать его для
проверки запросов на создание водителей.*/
export const driverCreateInputValidation = [
  resourceTypeValidation(ResourceType.Drivers),
  nameValidation,
  phoneNumberValidation,
  emailValidation,
  vehicleMakeValidation,
  vehicleModelValidation,
  vehicleYearValidation,
  vehicleLicensePlateValidation,
  vehicleDescriptionValidation,
  vehicleFeaturesValidation,
];

/*Комбинируем вышеуказанные middlewares в один middleware "driverUpdateInputValidation", чтобы использовать его для
проверки запросов на изменение водителей.*/
export const driverUpdateInputValidation = [
  resourceTypeValidation(ResourceType.Drivers),
  dataIdMatchValidation,
  nameValidation,
  phoneNumberValidation,
  emailValidation,
  vehicleMakeValidation,
  vehicleModelValidation,
  vehicleYearValidation,
  vehicleLicensePlateValidation,
  vehicleDescriptionValidation,
  vehicleFeaturesValidation,
];
