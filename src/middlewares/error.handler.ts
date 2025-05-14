import { Request, Response, NextFunction } from 'express'
import ValidationException from '@exceptions/validation.exception'
import { INTERNAL_SERVER_ERROR } from '@utils/http.status.code'
import HttpException from '@exceptions/http.exception'
import logger from '@config/logging'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const data = {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
    error: err.message,
    stack: err.stack
  }

  switch (true) {
    case err instanceof ValidationException:
      res.status((err as ValidationException).status).json({
        status: err.status,
        message: err.message,
        errors: (err as ValidationException).errors
      })
      break

    case err instanceof HttpException:
      logger.error('HTTP Exception', {
        ...data,
        status: err.status
      })

      res.status((err as HttpException).status).json({
        status: err.status,
        message: err.message
      })

    default:
      logger.error('Unhandled Error', data)

      res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: err.message
      })
      break
  }
}
