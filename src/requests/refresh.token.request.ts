import { body } from 'express-validator'

export const REFRESH_TOKEN_REQUEST = [body('refreshToken').notEmpty().isJWT()]
