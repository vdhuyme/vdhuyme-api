import { auth } from '@middlewares/authenticated'
import { Request, Response, NextFunction, RequestHandler } from 'express'

export function authenticate(): MethodDecorator {
  const middleware: RequestHandler = auth

  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): void {
    const originalMethod = descriptor.value as (
      req: Request,
      res: Response,
      next: NextFunction
    ) => unknown

    descriptor.value = function (req: Request, res: Response, next: NextFunction): void {
      middleware(req, res, (err?: unknown) => {
        if (err) return next(err)
        return originalMethod.call(this, req, res, next)
      })
    }
  }
}
