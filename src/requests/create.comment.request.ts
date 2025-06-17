import { body } from 'express-validator'

export const CREATE_COMMENT_REQUEST = [
  body('id').notEmpty().isInt().toInt(),
  body('content').notEmpty().isString().isLength({ min: 3, max: 1000 })
]
