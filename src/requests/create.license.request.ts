import { body, ValidationChain } from 'express-validator'

export const createLicenseRequest: ValidationChain[] = [
  body('licensedTo')
    .notEmpty()
    .withMessage('Licensed to is required')
    .isString()
    .withMessage('Licensed to must be a string')
    .trim(),
  body('activatedAt')
    .notEmpty()
    .withMessage('Activation date is required')
    .isISO8601()
    .withMessage('Activation date must be a valid ISO 8601 date')
    .trim(),
  body('expiresAt')
    .notEmpty()
    .withMessage('Expiration date is required')
    .isISO8601()
    .withMessage('Expiration date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (value && value <= req.body.activatedAt) {
        throw new Error('Expiration date must be after activation date')
      }
      return true
    })
    .trim()
]
