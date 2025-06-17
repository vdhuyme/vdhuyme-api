import { body } from 'express-validator'
import { BASE_STATUS } from '@constants/base.status'

export const CREATE_CATEGORY_REQUEST = [
  body('name').isString().notEmpty(),
  body('description').optional().isString(),
  body('thumbnail').optional({ checkFalsy: true }).isString(),
  body('icon').optional().isString(),
  body('parentId').optional({ checkFalsy: true }).isNumeric().toInt(),
  body('status').optional().isIn(Object.values(BASE_STATUS))
]
