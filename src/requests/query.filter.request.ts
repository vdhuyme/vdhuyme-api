import { query } from 'express-validator'

export const QUERY_FILTER_REQUEST = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
  query('search').optional().isString().isLength({ max: 100 }),
  query('sortBy').optional().isString().isLength({ max: 50 }),
  query('orderBy').optional().isString().isIn(['ASC', 'asc', 'DESC', 'desc']).toUpperCase()
]
