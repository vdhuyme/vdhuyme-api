import { body } from 'express-validator'

export const LOGIN_REQUEST = [
  body('email').notEmpty().isEmail().trim().normalizeEmail(),
  body('password').notEmpty().isLength({ max: 50 })
]
