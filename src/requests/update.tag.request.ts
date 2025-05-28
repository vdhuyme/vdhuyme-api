import { body, ValidationChain } from 'express-validator'

export const UPDATE_TAG_REQUEST: ValidationChain[] = [body('name').notEmpty().isLength({ max: 50 })]
