import jsonwebtoken from '@config/jsonwebtoken'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload | string
    }
  }
}

export const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.headers?.authorization?.split(' ')[1] || ''
  if (!token) {
    return next(new UnauthorizedException('Missing token'))
  }

  try {
    const decoded: JwtPayload | string = jsonwebtoken.verify(token)
    req.auth = decoded
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
