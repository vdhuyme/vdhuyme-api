import { before, beforeNow, isDate } from '@validators/date'
import { query, ValidationChain } from 'express-validator'

export const GA4_REQUEST: ValidationChain[] = [
  query('startAt').optional().custom(isDate).custom(before('endAt')),
  query('endAt').optional().custom(isDate).custom(beforeNow)
]
