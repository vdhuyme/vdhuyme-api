import { auth } from '@middlewares/authenticated'
import { validate } from '@middlewares/validation'
import QueryFilterRequest from '@requests/query.filter.request'
import { GA4_PROPERTY_ID, ga4Client } from '@utils/ga4.client'
import { format } from 'date-fns'
import express, { Request, Response } from 'express'
import { Ga4CountryStatResource } from 'mappers/ga4.mapper'

const router = express.Router()

router.get(
  '/stats',
  auth(),
  validate(QueryFilterRequest, 'query'),
  async (req: Request, res: Response) => {
    const { startDate, endDate } = req.validated as QueryFilterRequest

    const today = new Date()
    const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const defaultEnd = today
    const start = startDate ?? defaultStart
    const end = endDate ?? defaultEnd
    const [response] = await ga4Client.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
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
