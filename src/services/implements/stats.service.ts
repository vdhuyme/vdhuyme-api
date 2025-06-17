import { config } from '@config/app'
import { ga4Client } from '@config/ga4.client'
import { IGA4CountryStatResponse } from 'interfaces'
import { Ga4CountryStatResource } from '@mappers/ga4.mapper'
import { IStatsService } from '@services/contracts/stats.service.interface'
import { format } from 'date-fns'

export default class StatsService implements IStatsService {
  async ga4(startAt: Date, endAt: Date): Promise<IGA4CountryStatResponse[]> {
    const today = new Date()
    const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const defaultEnd = today
    const start = startAt ?? defaultStart
    const end = endAt ?? defaultEnd

    const [response] = await ga4Client.runReport({
      property: `properties/${config.ga4.propertyId}`,
      dateRanges: [
        {
          startDate: format(start, 'yyyy-MM-dd'),
          endDate: format(end, 'yyyy-MM-dd')
        }
      ],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }]
    })

    return Ga4CountryStatResource.collection(response)
  }
}
