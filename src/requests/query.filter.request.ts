import { query } from 'express-validator'

export const QUERY_FILTER_REQUEST = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1 }),
  query('search').optional().isString().isLength({ max: 100 }),
  query('sort')
    .optional()
    .customSanitizer(value => {
      if (!value) {
        return undefined
      }
      return value.split(',').map((part: string) => {
        const [field, order] = part.split(':')
        return [field, order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']
      })
    })
]
