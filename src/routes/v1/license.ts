import express, { NextFunction, Request, Response } from 'express'
import { OK } from '@utils/http.status.code'
import { getLicenseRequest } from '@requests/get.license.request'
import { validate } from '@middlewares/validation'
import { auth } from '@middlewares/authenticated'
import { createLicenseRequest } from '@requests/create.license.request'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import jsonwebtoken from '@config/jsonwebtoken'
import { db, License } from '@config/database'
import { id } from '@utils/id'
import { timestamp } from '@utils/timestamp'
import BadRequestException from '@exceptions/bad.request.exception'
import BaseStatusEnum from '@enums/base.status.enum'
import { updateLicenseStatusRequest } from '@requests/update.license.status.request'

const router = express.Router()

router.get('/', auth(), (req: Request, res: Response) => {
  const licenses = db.data.licenses
  res.status(OK).json({ licenses })
})

router.post('/', auth(), validate(createLicenseRequest), async (req: Request, res: Response) => {
  const { licensedTo, activatedAt, expiresAt } = req.body

  const activatedDate = new Date(activatedAt)
  const expiresDate = new Date(expiresAt)

  const diffInMs = expiresDate.getTime() - activatedDate.getTime()
  const toSeconds = Math.floor(diffInMs / 1000)

  const token = jsonwebtoken.generate({ licensedTo, activatedAt, expiresAt }, toSeconds)

  const license: License = {
    id: id(),
    licensedTo,
    activatedAt,
    expiresAt,
    token,
    status: BaseStatusEnum.APPROVED,
    createdAt: timestamp(),
    updatedAt: timestamp()
  }

  db.data.licenses.push(license)
  await db.write()

  res.status(OK).json({ token })
})

router.delete('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const license = db.data.licenses.find((license) => license.id === id)
  if (!license) {
    return next(new BadRequestException(`Not found license: ${id}`))
  }
  db.data.licenses = db.data.licenses.filter((license) => license.id !== id)
  await db.write()
  res.status(OK).json({ message: 'success' })
})

router.patch(
  '/:id',
  auth(),
  validate(updateLicenseStatusRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { status } = req.body
    const license = db.data.licenses.find((contact) => contact.id === id)
    if (!license) {
      return next(new BadRequestException(`Not found license: ${id}`))
    }

    license.status = status
    license.updatedAt = timestamp()
    await db.write()
    res.status(OK).json({ message: 'success' })
  }
)

router.post(
  '/validate',
  validate(getLicenseRequest),
  (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body

    const found = db.data.licenses.find(
      (license) => license.token === token && license.status === BaseStatusEnum.APPROVED
    )
    if (!found) {
      next(new UnauthorizedException('Token is not registered or not valid'))
    }

    try {
      jsonwebtoken.verify(token as string)
      const now = new Date()
      const activatedAt = new Date(found?.activatedAt as string)
      const expiresAt = new Date(found?.expiresAt as string)

      if (now < activatedAt) {
        return next(new UnauthorizedException('License is not active yet'))
      }

      if (now > expiresAt) {
        return next(new UnauthorizedException('License has expired'))
      }
      res.status(OK).json({ message: 'Valid license' })
    } catch (error: any) {
      const messages = {
        JsonWebTokenError: 'Invalid token',
        TokenExpiredError: 'License has expired'
      }
      const message = messages[error?.name as keyof typeof messages] || 'Invalid license'
      return next(new UnauthorizedException(message))
    }
  }
)

export default router
