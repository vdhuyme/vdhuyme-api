import { body, ValidationChain } from 'express-validator'

export const updatePostRequest: ValidationChain[] = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3, max: 1000 })
    .withMessage('Title must be between 3 and 1000 characters'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 3, max: 10000 })
    .withMessage('Description must be between 3 and 10000 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters'),
  body('thumbnail').optional().isString().withMessage('Thumbnail must be a string'),
  body('images').optional().isArray().withMessage('Images must be an array of strings'),
  body('images.*').isString().withMessage('Each image must be a string')
]
