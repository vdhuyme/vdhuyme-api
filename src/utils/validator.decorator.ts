import { plainToInstance } from 'class-transformer'
import { validate as classValidate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import ValidationException from '@exceptions/validation.exception'
import { RequestDataSource } from 'types'

export function createValidatorDecorator<T extends object>(
  dto: new () => T,
  source: RequestDataSource
): MethodDecorator {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor | void {
    if (!descriptor.value) {
      throw new Error('Method descriptor has no value')
    }

    const originalMethod = descriptor.value as (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<unknown>

    descriptor.value = async function (
      this: unknown,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      try {
        const raw = req[source] ?? {}
        const instance = plainToInstance(dto, raw, {
          enableImplicitConversion: true
        })

        const errors = await classValidate(instance, {
          skipMissingProperties: false,
          whitelist: true
        })

        if (errors.length > 0) {
          return next(new ValidationException(errors))
        }

        req.validated = instance

        return originalMethod.apply(this, [req, res, next])
      } catch (error) {
        return next(error)
      }
    }

    return descriptor
  }
}
