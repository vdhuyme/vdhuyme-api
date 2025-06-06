import { body, ValidationChain } from 'express-validator'

export const CHANGE_PASSWORD_REQUEST: ValidationChain[] = [
  body('oldPassword').notEmpty().isString(),
  body('newPassword').notEmpty().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
]
