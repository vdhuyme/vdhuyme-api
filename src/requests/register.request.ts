import { body, ValidationChain } from 'express-validator'

export const REGISTER_REQUEST: ValidationChain[] = [
  body('name').notEmpty().isLength({ max: 50 }),
  body('email').notEmpty().isEmail().trim().normalizeEmail(),
  body('password').notEmpty().isLength({ max: 50 })
]
