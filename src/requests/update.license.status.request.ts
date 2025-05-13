import BaseStatusEnum from '@enums/base.status.enum'
import { body, ValidationChain } from 'express-validator'

export const updateLicenseStatusRequest: ValidationChain[] = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(BaseStatusEnum))
    .withMessage('Invalid status')
]
