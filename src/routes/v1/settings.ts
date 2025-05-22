import express, { NextFunction, Request, Response } from 'express'
import { auth } from '@middlewares/authenticated'
import SetGoogleAnalystPropertyRequest from '@requests/set.google.analyst.property.request'
import { validate } from '@middlewares/validation'
import { db } from 'data-source'
import { Setting } from '@entities/setting'
import { CREATED } from '@utils/http.status.code'
import BadRequestException from '@exceptions/bad.request.exception'
import { GA4SettingValue } from 'types'

const router = express.Router()
const settingRepository = db.getRepository<Setting>(Setting)
const ga4SettingKey = 'google-analyst-property'

router.post(
  '/ga4-property',
  auth(),
  validate(SetGoogleAnalystPropertyRequest),
  async (req: Request, res: Response) => {
    const { isEnabled, propertyId } = req.validated as SetGoogleAnalystPropertyRequest

    const value: GA4SettingValue = { isEnabled, propertyId }
    await settingRepository.upsert({ key: ga4SettingKey, value: JSON.stringify(value) }, ['key'])

    res.status(CREATED).json({ message: 'success' })
  }
)

export const getGA4Setting = async (): Promise<GA4SettingValue | null> => {
  const setting = await settingRepository.findOne({ where: { key: ga4SettingKey } })
  if (!setting) {
    return null
  }
  return JSON.parse(setting.value) as GA4SettingValue
}

router.get('/ga4-property', auth(), async (req: Request, res: Response, next: NextFunction) => {
  const setting = await getGA4Setting()
  if (!setting) {
    return next(new BadRequestException(`Can not find setting ${ga4SettingKey}`))
  }

  res.status(CREATED).json({ setting })
})

export default router
