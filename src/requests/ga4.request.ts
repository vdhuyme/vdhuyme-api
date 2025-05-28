import { query, ValidationChain } from 'express-validator'

export const GA4_REQUEST: ValidationChain[] = [
  query('startAt').optional().isDate(),
  query('endAt').optional().isDate()
]
