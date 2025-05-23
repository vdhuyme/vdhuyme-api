import jsonwebtoken from '@config/jsonwebtoken'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import { IJwtAuthUserPayload } from 'interfaces'
import { NextFunction, Request, Response } from 'express'

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.headers?.authorization?.split(' ')[1] || ''
  if (!token) {
    return next(new UnauthorizedException('Missing token'))
  }

  try {
    const decoded = jsonwebtoken.verifyAccessToken(token)
    req.auth = decoded as IJwtAuthUserPayload
  } catch (error: unknown) {
    const messages: Record<string, string> = {
      JsonWebTokenError: 'Invalid token',
      TokenExpiredError: 'Token has expired'
    }
    const name = (error as { name: string }).name
    const message = messages[name] || 'Exception from authenticated middleware'

    return next(new UnauthorizedException(message))
  }

  next()
}
