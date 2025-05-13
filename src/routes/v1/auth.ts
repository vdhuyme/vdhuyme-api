import express, { NextFunction, Request, Response } from 'express'
import { OK } from '@utils/http.status.code'
import { validate } from '@middlewares/validation'
import { loginRequest } from '@requests/login.request'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import jsonwebtoken from '@config/jsonwebtoken'
import { db } from 'data-source'
import { User } from '@entities/user'
import bcrypt from 'bcryptjs'

const router = express.Router()

router.post(
  '/login',
  validate(loginRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const user = await db.getRepository(User).findOneBy({ email })
    if (!user) {
      return next(new UnauthorizedException('Invalid credentials'))
    }

    if (!bcrypt.compareSync(password, user.password)) {
      next(new UnauthorizedException())
    }
    const token = jsonwebtoken.generate({ email })
    res.status(OK).json({ token })
  }
)

export default router
