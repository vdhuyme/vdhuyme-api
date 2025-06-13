import { BASE_STATUS } from '@constants/base.status'
import { body, ValidationChain } from 'express-validator'

export const UPDATE_USER_STATUS_REQUEST: ValidationChain[] = [
  body('status').notEmpty().isIn(Object.values(BASE_STATUS))
]
