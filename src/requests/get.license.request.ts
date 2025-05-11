import { query, ValidationChain } from 'express-validator'

const getLicenseRequest: ValidationChain[] = [
  query('token')
    .notEmpty()
    .withMessage('Token is required')
    .isString()
    .withMessage('Token must be a string')
]

export { getLicenseRequest }
