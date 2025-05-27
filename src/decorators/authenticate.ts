/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import jsonwebtoken from '@config/jsonwebtoken'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import { IJwtAuthUserPayload } from 'interfaces'
import { NextFunction, Request, Response } from 'express'

declare global {
  namespace Express {
    interface Request {
      auth: IJwtAuthUserPayload
    }
  }
}

export function auth() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      try {
        // Extract token from Authorization header
        const token: string = req.headers?.authorization?.split(' ')[1] || ''

        if (!token) {
          throw new UnauthorizedException('Missing token')
        }

        try {
          // Verify JWT token
          const decoded = jsonwebtoken.verify(token)
          req.auth = decoded as IJwtAuthUserPayload
        } catch (error: unknown) {
          // Handle JWT specific errors
          const messages: Record<string, string> = {
            JsonWebTokenError: 'Invalid token',
            TokenExpiredError: 'Token has expired',
            NotBeforeError: 'Token not active yet',
            JsonSchemaError: 'Token format invalid'
          }

          const name = (error as { name: string }).name
          const message = messages[name] || 'Exception from authenticated middleware'

          throw new UnauthorizedException(message)
        }

        // If authentication passes, call original method
        return await originalMethod.call(this, req, res, next)
      } catch (error) {
        next(error)
      }
    }

    return descriptor
  }
}
