import { body, param, ValidationChain } from 'express-validator'

export const UPDATE_TAG_REQUEST: ValidationChain[] = [
  param('id').isInt().toInt(),
  body('name').notEmpty().isLength({ max: 50 })
]
