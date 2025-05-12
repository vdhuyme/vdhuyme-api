import { body, param, ValidationChain } from 'express-validator'

export const sendMailRequest: ValidationChain[] = [
  param('template').isIn(['contact']).withMessage('Template is in: contact'),

  body('name')
    .if(param('template').equals('contact'))
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),

  body('email')
    .if(param('template').equals('contact'))
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),

  body('message')
    .if(param('template').equals('contact'))
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
]
