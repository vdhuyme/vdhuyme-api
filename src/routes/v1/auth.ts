import express, { NextFunction, Request, Response } from 'express'
import { OK } from '@utils/http.status.code'
import { validate } from '@middlewares/validation'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import jsonwebtoken from '@config/jsonwebtoken'
import { db } from 'data-source'
import { User } from '@entities/user'
import bcrypt from 'bcryptjs'
import BaseStatusEnum from '@enums/base.status.enum'
import LoginRequest from '@requests/login.request'

const router = express.Router()

router.post(
  '/login',
  validate(LoginRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as LoginRequest

    const user = await db
      .getRepository<User>(User)
      .findOneBy({ email, status: BaseStatusEnum.ACTIVATED })
    if (!user) {
      return next(new UnauthorizedException('Invalid credentials'))
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(new UnauthorizedException('Invalid credentials'))
    }
    const token = jsonwebtoken.generate({ email })

    res.status(OK).json({ token })
  }
)

export default router
