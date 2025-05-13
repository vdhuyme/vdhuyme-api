import { isAfter, isValid, parseISO } from 'date-fns'
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
    .bail()
    .isISO8601()
    .withMessage('Activation date must be a valid ISO 8601 date'),
  body('expiresAt')
    .notEmpty()
    .withMessage('Expiration date is required')
    .bail()
    .custom((value, { req }) => {
      const expiresAt = parseISO(value)
      const activatedAt = parseISO(req.body.activatedAt)

      if (!isValid(expiresAt) || !isValid(activatedAt)) {
        throw new Error('Dates must be valid ISO8601 strings')
      }

      if (!isAfter(expiresAt, activatedAt)) {
        throw new Error('Expiration date must be after activation date')
      }

      return true
    })
    .trim()
]
