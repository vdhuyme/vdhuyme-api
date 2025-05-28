import { body } from 'express-validator'
import { BASE_STATUS } from '@constants/base.status'

export const UPDATE_CATEGORY_REQUEST = [
  body('name').isString().notEmpty(),
  body('description').optional().isString(),
  body('thumbnail').optional().isString(),
  body('icon').optional().isString(),
  body('parentId').optional({ nullable: true }).isNumeric().toInt(),
  body('status').optional().isIn(Object.values(BASE_STATUS))
]
