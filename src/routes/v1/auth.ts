import express, { NextFunction, Request, Response } from 'express'
import { OK } from '@utils/http.status.code'
import { validate } from '@middlewares/validation'
import { loginRequest } from '@requests/login.request'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import jsonwebtoken from '@config/jsonwebtoken'

const router = express.Router()

router.post('/login', validate(loginRequest), (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  const { SUPER_USER, SUPER_USER_PWD } = process.env
  if (email !== SUPER_USER || password !== SUPER_USER_PWD) {
    next(new UnauthorizedException())
  }
  const token = jsonwebtoken.generate({ email })
  res.status(OK).json({ token })
})

export default router
