import { Request, Response, NextFunction, RequestHandler } from 'express'
import { validationResult, ValidationChain, Result, ValidationError } from 'express-validator'
import ValidationException from '@exceptions/validation.exception'

export const validate = (validations: ValidationChain[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors: Result<ValidationError> = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()))
    }

    next()
  }
}
