import { body, ValidationChain } from 'express-validator'

const getLicenseRequest: ValidationChain[] = [
  body('token')
    .notEmpty()
    .withMessage('Token is required')
    .isString()
    .withMessage('Token must be a string')
]

export { getLicenseRequest }
