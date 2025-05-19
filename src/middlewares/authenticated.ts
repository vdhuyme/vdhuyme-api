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

export const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.headers?.authorization?.split(' ')[1] || ''
  if (!token) {
    return next(new UnauthorizedException('Missing token'))
  }

  try {
    const decoded = jsonwebtoken.verify(token)
    req.auth = decoded as IJwtAuthUserPayload
  } catch (error: any) {
    const messages = {
      JsonWebTokenError: 'Invalid token',
      TokenExpiredError: 'Token has expired'
    }
    const message = messages[error?.name as keyof typeof messages] || 'Authentication error'
    return next(new UnauthorizedException(message))
  }

  next()
}
