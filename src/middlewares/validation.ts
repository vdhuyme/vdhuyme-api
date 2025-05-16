/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { plainToInstance } from 'class-transformer'
import { validate as classValidate } from 'class-validator'
import { RequestHandler } from 'express'
import ValidationException from '@exceptions/validation.exception'

declare global {
  namespace Express {
    interface Request {
      validated: any
    }
  }
}

export const validate = (
  dto: any,
  source: 'body' | 'query' | 'params' | 'header' | 'headers' = 'body'
): RequestHandler => {
  return async (req, res, next) => {
    const data = req[source] ?? {}
    const instance = plainToInstance(dto, data, {
      enableImplicitConversion: true
    })
    const errors = await classValidate(instance)
    if (errors.length > 0) {
      return next(new ValidationException(errors))
    }
    req.validated = instance

    next()
  }
}
