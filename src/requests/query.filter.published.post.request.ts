import { query, ValidationChain } from 'express-validator'
import { QUERY_FILTER_REQUEST } from '@requests/query.filter.request'

export const QUERY_FILTER_PUBLISHED_POST_REQUEST: ValidationChain[] = [
  ...QUERY_FILTER_REQUEST,
  query('categoryId').optional({ checkFalsy: true }).isInt({ min: 1 }).toInt()
]
