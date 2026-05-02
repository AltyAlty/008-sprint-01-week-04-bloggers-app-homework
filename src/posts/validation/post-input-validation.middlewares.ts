import { body } from 'express-validator';

export const titleValidation = body('title')
  .isString()
  .withMessage('title should be a string')
  .trim()
  .isLength({ min: 1, max: 30 });

export const shortDescriptionValidation = body('shortDescription')
  .isString()
  .withMessage('shortDescription should be a string')
  .trim()
  .isLength({ min: 1, max: 100 });

export const contentValidation = body('content')
  .isString()
  .withMessage('content should be a string')
  .trim()
  .isLength({ min: 1, max: 1000 });

export const blogIdValidation = body('blogId')
  .isString()
  .withMessage('blogId should be a string')
  .trim()
  .isLength({ min: 1 });

export const postCreateInputValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];

export const postUpdateInputValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];

export const postInExistingBlogCreateInputValidation = [titleValidation, shortDescriptionValidation, contentValidation];
