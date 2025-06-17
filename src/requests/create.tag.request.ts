import { BASE_STATUS } from '@constants/base.status'
import { body, ValidationChain } from 'express-validator'

export const CREATE_TAG_REQUEST: ValidationChain[] = [
  body('name').notEmpty().isLength({ max: 50 }),
  body('status').optional().isIn(Object.values(BASE_STATUS))
]
