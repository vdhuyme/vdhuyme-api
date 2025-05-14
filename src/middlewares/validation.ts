import { plainToInstance } from 'class-transformer'
import { validate as classValidate } from 'class-validator'
import { RequestHandler } from 'express'
import ValidationException from '@exceptions/validation.exception'

export const validate = (dto: any): RequestHandler => {
  return async (req, res, next) => {
    const instance = plainToInstance(dto, req.body)
    const errors = await classValidate(instance)
    if (errors.length) {
      return next(new ValidationException(errors))
    }

    req.body = instance
    next()
  }
}
