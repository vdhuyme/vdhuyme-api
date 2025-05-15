import express, { NextFunction, Request, Response } from 'express'
import { OK } from '@utils/http.status.code'
import { validate } from '@middlewares/validation'
import { auth } from '@middlewares/authenticated'
import CreateLicenseRequest from '@requests/create.license.request'
import UnauthorizedException from '@exceptions/unauthorized.exception'
import jsonwebtoken from '@config/jsonwebtoken'
import BadRequestException from '@exceptions/bad.request.exception'
import BaseStatusEnum from '@enums/base.status.enum'
import { isAfter, isBefore, parseISO } from 'date-fns'
import { db } from 'data-source'
import { License } from '@entities/license'
import GetLicenseRequest from '@requests/get.license.request'
import UpdateLicenseStatusRequest from '@requests/update.license.status.request'

const router = express.Router()

router.get('/', auth(), async (_req: Request, res: Response) => {
  const licenses = await db.getRepository<License>(License).find({ order: { createdAt: 'DESC' } })

  res.status(OK).json({ licenses })
})

router.post('/', auth(), validate(CreateLicenseRequest), async (req: Request, res: Response) => {
  const { licensedTo, activatedAt, expiresAt } = req.body as CreateLicenseRequest

  const activatedDate = new Date(activatedAt)
  const expiresDate = new Date(expiresAt)
  const diffInMs = expiresDate.getTime() - activatedDate.getTime()
  const toSeconds = Math.floor(diffInMs / 1000)

  const token = jsonwebtoken.generate({ licensedTo, activatedAt, expiresAt }, toSeconds)
  const licenseRepository = db.getRepository<License>(License)

  const license = licenseRepository.create({
    licensedTo,
    activatedAt,
    expiresAt,
    token
  })

  await licenseRepository.save(license)
  res.status(OK).json({ token })
})

router.delete('/:id', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id)

  const licenseRepository = db.getRepository(License)
  const license = await licenseRepository.findOneBy({ id })
  if (!license) {
    return next(new BadRequestException(`Not found license: ${id}`))
  }
  await licenseRepository.remove(license)

  res.status(OK).json({ message: 'success' })
})

router.patch(
  '/:id',
  auth(),
  validate(UpdateLicenseStatusRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)
    const { status } = req.body as UpdateLicenseStatusRequest

    const licenseRepository = db.getRepository(License)
    const license = await licenseRepository.findOneBy({ id })
    if (!license) {
      return next(new BadRequestException(`Not found license: ${id}`))
    }

    license.status = status
    await licenseRepository.save(license)

    res.status(OK).json({ message: 'success' })
  }
)

router.post(
  '/validate',
  validate(GetLicenseRequest),
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body as GetLicenseRequest

    const licenseRepository = db.getRepository(License)
    const found = await licenseRepository.findOneBy({
      token,
      status: BaseStatusEnum.ACTIVATED
    })

    if (!found) {
      return next(new UnauthorizedException('Token is not registered or not valid'))
    }

    const now = new Date()
    const activatedAt = parseISO(found.activatedAt)
    const expiresAt = parseISO(found.expiresAt)

    if (isBefore(now, activatedAt)) {
      return next(new UnauthorizedException('License is not active yet'))
    }

    if (isAfter(now, expiresAt)) {
      return next(new UnauthorizedException('License has expired'))
    }

    try {
      jsonwebtoken.verify(token)
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
