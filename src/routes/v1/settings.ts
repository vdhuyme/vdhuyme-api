import express, { Request, Response } from 'express'
import { auth } from '@middlewares/authenticated'
import SetGoogleAnalystPropertyRequest from '@requests/set.google.analyst.property.request'
import { validate } from '@middlewares/validation'
import { db } from 'data-source'
import { Setting } from '@entities/setting'
import { CREATED } from '@utils/http.status.code'

const router = express.Router()
const settingRepository = db.getRepository<Setting>(Setting)

router.post(
  '/ga4-property',
  auth(),
  validate(SetGoogleAnalystPropertyRequest),
  async (req: Request, res: Response) => {
    const { propertyId } = req.validated as SetGoogleAnalystPropertyRequest

    await settingRepository.upsert({ key: 'google-analyst-property', value: propertyId }, ['key'])

    res.status(CREATED).json({ message: 'success' })
  }
)

export default router
