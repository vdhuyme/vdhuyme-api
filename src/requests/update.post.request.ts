import { body } from 'express-validator'
import { BASE_STATUS } from '@constants/base.status'

export const UPDATE_POST_REQUEST = [
  body('title').isString().isLength({ min: 3, max: 1000 }),
  body('excerpt').isString().isLength({ min: 3, max: 1000 }),
  body('content').isString().isLength({ min: 10 }),
  body('thumbnail').optional({ checkFalsy: true }).isString(),
  body('readTime').optional({ checkFalsy: true }).isInt({ min: 1 }).toInt(),
  body('categoryId').isInt({ min: 1 }).toInt(),
  body('status').optional().isIn(Object.values(BASE_STATUS)),
  body('tagIds').isArray({ min: 0 }).withMessage('Tags must be an array'),
  body('tagIds.*').isInt({ min: 1 })
]
