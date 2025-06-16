import { body, ValidationChain } from 'express-validator'

export const UPDATE_PROFILE_REQUEST: ValidationChain[] = [
  body('name').optional({ checkFalsy: true }).isString().isLength({ max: 50 }),
  body('avatar').optional({ checkFalsy: true }).isString().isLength({ max: 255 }),
  body('phoneNumber').optional({ checkFalsy: true }).isString().isLength({ max: 15 }),
  body('dob').optional({ checkFalsy: true }).isDate()
]
