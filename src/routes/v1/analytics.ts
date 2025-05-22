import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import QueryFilterRequest from '@requests/query.filter.request'
import { ga4Client } from '@utils/ga4.client'
import { format } from 'date-fns'
import express, { NextFunction, Request, Response } from 'express'
import { Ga4CountryStatResource } from 'mappers/ga4.mapper'
import { getGA4Setting } from '@routes/v1/settings'
import BadRequestException from '@exceptions/bad.request.exception'

const router = express.Router()

router.get(
  '/stats',
  auth(),
  validate(QueryFilterRequest, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.validated as QueryFilterRequest

    const setting = await getGA4Setting()
    if (!setting?.isEnabled || !setting.propertyId) {
      return next(new BadRequestException('Not found GA4 setting.'))
    }
    const today = new Date()
    const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const defaultEnd = today
    const start = startDate ?? defaultStart
    const end = endDate ?? defaultEnd
    const [response] = await ga4Client.runReport({
      property: `properties/${setting.propertyId}`,
      dateRanges: [
        {
          startDate: format(start, 'yyyy-MM-dd'),
          endDate: format(end, 'yyyy-MM-dd')
        }
      ],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }]
    })
    const data = Ga4CountryStatResource.collection(response)

    res.json({ data })
  }
)

export default router
