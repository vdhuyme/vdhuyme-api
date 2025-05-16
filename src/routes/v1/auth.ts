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
import { auth } from '@middlewares/authenticated'

const router = express.Router()
const userRepository = db.getRepository<User>(User)

router.get('/me', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const { userId: id } = req.auth

  const user = await userRepository
    .createQueryBuilder('user')
    .select([
      'user.id',
      'user.avatar',
      'user.email',
      'user.name',
      'user.status',
      'user.createdAt',
      'user.updatedAt'
    ])
    .where('user.id = :id', { id })
    .getOne()
  if (!user) {
    return next(new UnauthorizedException('Invalid credentials'))
  }

  res.status(OK).json({ user })
})

router.post(
  '/login',
  validate(LoginRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.validated as LoginRequest

    const user = await userRepository.findOneBy({ email, status: BaseStatusEnum.ACTIVATED })
    if (!user) {
      return next(new UnauthorizedException('Invalid credentials'))
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(new UnauthorizedException('Invalid credentials'))
    }
    const token = jsonwebtoken.generate({ userId: user.id, email: user.email })

    res.status(OK).json({ token })
  }
)

export default router
