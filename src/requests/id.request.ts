import { param, ValidationChain } from 'express-validator'

export const ID_REQUEST: ValidationChain[] = [param('id').isInt({ min: 1 }).toInt()]
