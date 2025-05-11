import { Request, Response, NextFunction } from 'express'
import NotFoundException from '@exceptions/not.found.exception'

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundException())
}
