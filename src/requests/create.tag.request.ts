import { body, ValidationChain } from 'express-validator'

export const CREATE_TAG_REQUEST: ValidationChain[] = [body('name').notEmpty().isLength({ max: 50 })]
