import { body } from 'express-validator'
import { BASE_STATUS } from '@constants/base.status'

export const UPDATE_COMMENT_REQUEST = [
  body('content').notEmpty().isString().isLength({ min: 3, max: 1000 }),
  body('status').optional().isIn(Object.values(BASE_STATUS))
]
